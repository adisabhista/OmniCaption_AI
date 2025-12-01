FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Pillow/OpenCV if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run provides the PORT environment variable
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"
