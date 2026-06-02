# TruthLens AI

TruthLens AI is a free AI-generated text detection platform with a Next.js frontend and a FastAPI backend. The frontend calls its own Next API proxy, and the proxy connects to the backend service, so the browser never needs to know the private backend address on Render.

## Structure

```text
.
├── backend/        # FastAPI detection API
├── frontend/       # Next.js app and API proxy
├── render.yaml     # Render Blueprint for both services
└── .env.example    # Local development env template
```

## Local Development

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Set local environment variables from `.env.example` when needed. Do not commit real `.env` files.

## Render Deployment

This repo is ready for Render Blueprint deployment.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml` from the repo root.
4. Enter `HF_TOKEN` when Render prompts for it.
5. Click deploy.

The Blueprint creates:

- `truthlens-ai-backend`: FastAPI service with `/health` and `/api/v1/detection/detect`.
- `truthlens-ai-frontend`: Next.js service that proxies detection requests to the backend over Render private networking.

Only `HF_TOKEN` is required during deployment.
