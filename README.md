# TruthLens AI — Enterprise-Grade AI Text Detection

![TruthLens AI](https://img.shields.io/badge/TruthLens-AI-blueviolet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

TruthLens AI is an advanced, high-precision content authenticity platform designed to detect AI-generated text. Powered by an ELECTRA deep learning model, it offers accurate sentence-level analysis, multi-language support with automatic translation, and detailed reporting.

---

## 🚀 Features

- **High Precision Detection:** Utilizes ELECTRA-based models fine-tuned on diverse AI text sources.
- **Detailed Sentence Analysis:** Highlights exactly which sentences are most likely AI-generated.
- **Dashboard Tools:** Paste text, upload documents (TXT), or scan URLs directly from the dashboard.
- **Reporting & Export:** Maintain a local history of your scans and export them as PDF, JSON, or CSV.
- **API Access:** Integrate the detection engine directly into your own applications.
- **Browser Extension:** Scan webpages in real-time with the included Chrome/Edge extension.

---

## 🧩 Browser Extension

The project includes a full-featured browser extension that lets you scan any webpage or selected text instantly.

### Quick Install

1. Download the extension ZIP by clicking the **Download Extension** button on the TruthLens website.
2. Unzip the downloaded folder.
3. Open your browser's extension page (`chrome://extensions/` for Chrome/Edge/Brave).
4. Enable **Developer Mode** (usually a toggle in the top-right corner).
5. Click **"Load unpacked"** and select the unzipped folder.

*Now you can scan any webpage by clicking the extension icon or highlighting text and right-clicking!*

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Python, HuggingFace Inference API, Google Translate (async)
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## 📖 API Usage

The detection engine is accessible via REST API. 

**Endpoint:** `POST /api/v1/detection/detect`

**Example Request:**
```bash
curl -X POST https://your-backend-url/api/v1/detection/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "The rapid advancement of artificial intelligence has revolutionized many industries."}'
```

**Example Response:**
```json
{
  "probability": 85.5,
  "label": "Likely AI-Generated",
  "segments": 1,
  "segmentDetails": [ ... ],
  "sentenceDetails": [ ... ]
}
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- HuggingFace API Token (`HF_TOKEN`)

### 1. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Add your HF_TOKEN to a .env file
echo "HF_TOKEN=your_token_here" > .env

uvicorn main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 📝 License

This project is licensed under the MIT License.
