import re
import math
import httpx
from app.config import settings

def clean_text(text: str) -> str:
    """Preprocess text by removing artifacts (ported from extension)."""
    text = re.sub(r'<<.*?>>', '', text)
    text = re.sub(r'\s+([?.!,;:])', r'\1', text)
    text = re.sub(r'#{1,6}\s*', ' ', text)
    text = re.sub(r'```', '', text)
    text = text.replace('`', '').replace('**', '').replace('__', '')
    text = text.replace('\\[', '').replace('\\]', '').replace('\\(', '').replace('\\)', '')
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    text = re.sub(r'URL_\d+', '', text)
    return text

def is_likely_english(text: str) -> bool:
    """Detect if text is primarily English."""
    latin_chars = len(re.findall(r'[a-zA-Z]', text))
    all_alpha = len(re.findall(r'[^\W\d_]', text))
    if all_alpha == 0:
        return True
    return (latin_chars / all_alpha) > 0.7

def segment_text(text: str, max_chars: int = 1500) -> list[str]:
    """Segment text into chunks for the model."""
    if len(text) <= max_chars:
        return [text]

    segments = []
    # Split by sentence boundaries roughly
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current = ""

    for sentence in sentences:
        if len(current + " " + sentence) > max_chars and len(current) > 0:
            segments.append(current.strip())
            current = sentence
        else:
            current += (" " if current else "") + sentence

    if current.strip():
        segments.append(current.strip())
        
    return segments

def softmax(logits: list[float]) -> float:
    """Convert logits to AI probability."""
    max_logit = max(logits)
    scaled_logits = [math.exp(l - max_logit) for l in logits]
    total = sum(scaled_logits)
    probs = [l / total for l in scaled_logits]
    return probs[1]

async def translate_text(text: str) -> str:
    """Translate non-English text to English."""
    url = f"{settings.TRANSLATE_API_URL}?client=gtx&sl=auto&tl=en&dt=t&q={text}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        translated = "".join(item[0] for item in data[0])
        return translated

async def predict_segment(text: str) -> list[float]:
    """Call HF API to predict AI likelihood for a segment."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.HF_TOKEN}"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.HF_API_URL,
            headers=headers,
            json={"inputs": text},
            timeout=30.0
        )
        response.raise_for_status()
        data = response.json()
        
        # Format can be [[logit0, logit1]] or [logit0, logit1]
        logits = data[0] if isinstance(data[0], list) else data
        return logits

async def analyze_full_text(raw_text: str) -> dict:
    """Full analysis pipeline."""
    text = clean_text(raw_text)
    
    if not text or len(text) < 150:
        return {"probability": 0, "label": "Text too short (Need 150+ chars)", "segments": 0, "error": True}
        
    if not is_likely_english(text):
        text = await translate_text(text)
        
    segments = segment_text(text, 1500)
    
    results = []
    segment_details = []
    
    for segment in segments:
        if len(segment.strip()) < 10:
            continue
        try:
            logits = await predict_segment(segment)
            prob = softmax(logits)
            results.append({"prob": prob, "length": len(segment)})
            segment_details.append({"text": segment, "probability": prob * 100})
        except Exception as e:
            segment_details.append({"text": segment, "probability": -1})
            
    if not results:
        return {"probability": 0, "label": "Analysis failed", "segments": 0, "error": True}
        
    total_len = sum(r["length"] for r in results)
    weighted_prob = sum(r["prob"] * r["length"] for r in results) / total_len
    
    probability = weighted_prob * 100
    
    if probability > 75:
        label = "Likely AI-Generated"
    elif probability > 50:
        label = "Possibly AI-Generated"
    elif probability > 30:
        label = "Mixed / Uncertain"
    else:
        label = "Likely Human-Written"
        
    sentence_details = []
    for seg in segment_details:
        if seg["probability"] < 0:
            continue
        sentences = re.split(r'(?<=[.!?])\s+', seg["text"])
        for sentence in sentences:
            if sentence.strip():
                sentence_details.append({
                    "text": sentence.strip(),
                    "probability": seg["probability"]
                })
                
    return {
        "probability": probability,
        "label": label,
        "segments": len(results),
        "segmentDetails": segment_details,
        "sentenceDetails": sentence_details
    }
