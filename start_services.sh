#!/bin/bash

# Activate virtual environment
source /app/venv/bin/activate

# Start AI Copilot Service (Flask) in background
echo "Starting AI Copilot Service..."
python /app/ai-engine/ai_copilot_service.py &

# Start Backend (Java Spring Boot)
echo "Starting Spring Boot Backend..."
exec java -jar /app/app.jar
