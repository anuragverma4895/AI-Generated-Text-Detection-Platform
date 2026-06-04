# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Image (Python + Node.js)
FROM python:3.11-slim

# Install Node.js (needed to run Next.js standalone server)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Setup Backend ---
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ backend/

# --- Setup Frontend ---
WORKDIR /app/frontend
# The standalone output requires public and .next/static folders
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static

WORKDIR /app

# Create start script
RUN echo '#!/bin/bash\n\
echo "Starting FastAPI Backend..."\n\
cd /app/backend\n\
uvicorn app.main:app --host 127.0.0.1 --port 8000 &\n\
\n\
echo "Starting Next.js Frontend..."\n\
cd /app/frontend\n\
export BACKEND_API_URL=http://127.0.0.1:8000/api/v1\n\
export HOSTNAME=0.0.0.0\n\
# Render injects $PORT. Next.js standalone server respects it.\n\
exec node server.js\n\
' > start.sh && chmod +x start.sh

# Start the unified container
CMD ["bash", "/app/start.sh"]
