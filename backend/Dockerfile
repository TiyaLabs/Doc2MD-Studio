FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (diperlukan oleh markitdown)
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 && rm -rf /var/lib/apt/lists/*

# Copy requirements & install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy sisa file backend
COPY . .

# Hugging face menggunakan port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]