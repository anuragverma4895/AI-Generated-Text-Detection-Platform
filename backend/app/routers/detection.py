from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.detector import analyze_full_text

router = APIRouter()

class DetectionRequest(BaseModel):
    text: str

class SentenceDetail(BaseModel):
    text: str
    probability: float

class SegmentDetail(BaseModel):
    text: str
    probability: float

class DetectionResponse(BaseModel):
    probability: float
    label: str
    segments: int
    segmentDetails: Optional[List[SegmentDetail]] = []
    sentenceDetails: Optional[List[SentenceDetail]] = []
    error: Optional[bool] = False

@router.post("/detect", response_model=DetectionResponse)
async def detect_text(request: DetectionRequest):
    """
    Analyze text to determine AI generation probability.
    """
    try:
        result = await analyze_full_text(request.text)
        if result.get("error"):
            raise HTTPException(status_code=400, detail=result.get("label"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
