FROM eclipse-temurin:21-jdk

# Install Python 3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create a virtual environment to avoid system package conflicts
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install CPU-only PyTorch to avoid massive NVIDIA downloads (2GB -> 200MB)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install
COPY ai-engine/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY start_services.sh /app/start_services.sh
RUN chmod +x /app/start_services.sh

COPY backend/target/*.jar /app/app.jar

EXPOSE 8080 5000

CMD ["/app/start_services.sh"]
