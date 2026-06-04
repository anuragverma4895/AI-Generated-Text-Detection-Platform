# TruthLens AI

TruthLens AI is a free AI-generated text detection platform with a Next.js frontend and a FastAPI backend. The frontend calls its own Next API proxy (`/api/detect`), which internally reaches the backend over Render's private network — the browser never touches the backend directly.

## Structure

```text
.
├── backend/        # FastAPI detection API (Python 3.11)
├── frontend/       # Next.js app with API proxy route
├── render.yaml     # Render Blueprint — deploys both services
├── docker-compose.yml  # Local Docker setup (optional)
└── .env.example    # Local development env template
```

## Local Development

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Copy `.env.example` to `.env` in the project root and fill in your `HF_TOKEN`. Do **not** commit real `.env` files.

## Render Deployment

This repo uses **Render Blueprints** (Infrastructure-as-Code via `render.yaml`).

### Steps

1. Push this repository to GitHub.
2. Go to [Render Dashboard → New → Blueprint](https://dashboard.render.com/select-repo?type=blueprint).
3. Select this repository — Render auto-detects `render.yaml`.
4. Set `HF_TOKEN` when prompted (your HuggingFace API token).
5. Click **Apply** → both services deploy automatically.

### What Gets Created

| Service | Type | URL |
|---------|------|-----|
| `truthlens-ai-backend` | Web Service (Python) | `https://truthlens-ai-backend.onrender.com` |
| `truthlens-ai-frontend` | Web Service (Node) | `https://truthlens-ai-frontend.onrender.com` |

### How They Connect

- Frontend → Backend communication happens over **Render's private network** using the `BACKEND_HOSTPORT` env var (auto-injected by Render).
- The frontend's API route (`/api/detect`) proxies requests to the backend at `http://<BACKEND_HOSTPORT>/api/v1/detection/detect`.
- No CORS issues since the proxy runs server-side.

### Environment Variables

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `HF_TOKEN` | Backend | ✅ Yes | HuggingFace API token |
| `HF_API_URL` | Backend | No (has default) | HF model endpoint |
| `TRANSLATE_API_URL` | Backend | No (has default) | Google Translate endpoint |
| `BACKEND_HOSTPORT` | Frontend | Auto-injected | Render fills this from backend service |

Only `HF_TOKEN` needs to be set manually during deployment.
