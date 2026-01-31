# Deploying SynthoGen Platform on a VPS

This guide explains how to deploy the SynthoGen Platform to a Linux Virtual Private Server (VPS) like DigitalOcean, AWS EC2, or Linode.

## Prerequisites

*   **A VPS**: Latest Ubuntu LTS (22.04 or 24.04 recommended).
    *   **RAM**: Minimum 8GB (Running Java + Database + AI Model requires significant memory).
    *   **Storage**: 50GB+.
*   **Domain Name** (Optional but recommended): e.g., `synthogen.yourdomain.com`.

## Step 1: Server Setup

1.  **SSH into your server:**
    ```bash
    ssh root@your_server_ip
    ```

2.  **Update the system:**
    ```bash
    apt update && apt upgrade -y
    ```

3.  **Install Docker & Docker Compose:**
    ```bash
    # Install dependencies
    apt install -y apt-transport-https ca-certificates curl software-properties-common

    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    ```

## Step 2: Clone and Configuration

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Kishankumar1328/SYNTHESIS.git
    cd SYNTHESIS
    ```

2.  **Verify Configuration:**
    *   Check `docker-compose.yml`.
    *   Ensure `OLLAMA_MODEL: gemma:2b` is set.
    *   In production, you should change default passwords in `docker-compose.yml` and `setup_mysql.sql`.

## Step 3: Launch the Application

1.  **Start Services:**
    ```bash
    docker compose up -d --build
    ```

2.  **Initialize AI Model:**
    Wait for the containers to start, then pull the LLM model inside the Ollama container.
    ```bash
    # Check if ollama is running
    docker ps 

    # Pull the model (This might take a few minutes)
    docker exec -it connect-ollama ollama pull gemma:2b
    ```

3.  **Verify Status:**
    ```bash
    docker compose ps
    ```
    All services (`db`, `backend`, `frontend`, `ollama`) should be "Up".

## Step 4: Access the Application

*   **Frontend**: `http://your_server_ip:5173`
*   **Backend API**: `http://your_server_ip:8080/api`
*   **AI Chat**: `http://your_server_ip:5000` (Proxied via Frontend)

## Optional: Domain & SSL (Production Ready)

For a production setup, use Nginx on the host (outside Docker) as a reverse proxy with Let's Encrypt SSL.

1.  **Install Nginx on host:**
    ```bash
    apt install nginx certbot python3-certbot-nginx
    ```

2.  **Configure Nginx:**
    Create `/etc/nginx/sites-available/synthogen`:
    ```nginx
    server {
        server_name synthogen.yourdomain.com;

        location / {
            proxy_pass http://localhost:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api {
            proxy_pass http://localhost:8080;
        }
    }
    ```

3.  **Enable and Secure:**
    ```bash
    ln -s /etc/nginx/sites-available/synthogen /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
    certbot --nginx -d synthogen.yourdomain.com
    ```
