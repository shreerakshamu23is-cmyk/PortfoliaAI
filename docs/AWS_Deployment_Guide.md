# AWS Deployment Guide for PortfolioAI 🚀

This step-by-step guide will help you deploy the **PortfolioAI** application (FastAPI backend + Next.js frontend) to **Amazon Web Services (AWS)** using an AWS EC2 Ubuntu instance, Nginx reverse proxy, PM2 process manager, Systemd, and free SSL via Certbot.

---

## 📋 Prerequisites

1. Active **AWS Account**.
2. A SSH Key Pair (`.pem` file) created in AWS EC2 Console.
3. (Optional) Custom Domain Name (e.g. from AWS Route 53, Namecheap, or GoDaddy).

---

## Step 1: Launch an AWS EC2 Instance

1. Log into your **AWS Management Console** and open the **EC2 Dashboard**.
2. Click **Launch Instance**.
3. **Name**: `PortfolioAI-Production`
4. **AMI**: Select **Ubuntu 24.04 LTS** (64-bit x86).
5. **Instance Type**: 
   - Recommended: `t3.small` (2 vCPU, 2 GB RAM) for smooth Next.js build & FastAPI execution.
   - Free Tier: `t3.micro` (2 vCPU, 1 GB RAM).
6. **Key Pair**: Select your key pair or create a new one (e.g. `portfolioai-key.pem`).
7. **Network / Security Group Rules**:
   Check the following checkmarks:
   - ✅ **Allow SSH traffic** (Port 22)
   - ✅ **Allow HTTP traffic** (Port 80)
   - ✅ **Allow HTTPS traffic** (Port 443)
8. **Storage**: Set size to **20 GB GP3**.
9. Click **Launch Instance**.

---

## Step 2: Connect to Your EC2 Instance via SSH

Open your terminal (PowerShell / macOS Terminal) where your `.pem` key file is saved:

```bash
# Set file permissions (Linux/macOS)
chmod 400 portfolioai-key.pem

# Connect to EC2 (Replace with your EC2 Public IP address)
ssh -i "portfolioai-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Step 3: Install Node.js, Python, Nginx & PM2

Run the following commands inside your EC2 terminal:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Python 3, pip, Git, Nginx & Build tools
sudo apt install -y python3-pip python3-venv git nginx curl build-essential

# 3. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 globally (Process Manager for Next.js)
sudo npm install -g pm2
```

---

## Step 4: Clone Project & Configure Backend (FastAPI)

```bash
# Navigate to web root directory
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

# Clone your GitHub repository
git clone https://github.com/your-username/PortfoliaAI.git
cd PortfoliaAI/backend

# Create virtual environment & install requirements
pip install "pydantic>=2.10.0" "pydantic-core>=2.27.0" --only-binary=:all:

pip install fastapi uvicorn python-multipart pydantic-settings email-validator sqlalchemy alembic python-jose passlib python-dotenv pypdf pdfplumber python-docx httpx Jinja2 --only-binary=:all:


# Create .env file for production backend
nano .env
```

Paste your production `.env` configuration:
```env
PROJECT_NAME="PortfolioAI API"
VERSION="1.0.0"
SECRET_KEY="your_production_jwt_secret_key_change_this"
DATABASE_URL="sqlite:////var/www/PortfoliaAI/backend/portfolioai.db"

# Optional IBM Granite API credentials
WATSONX_APIKEY="your_watsonx_api_key"
WATSONX_PROJECT_ID="your_watsonx_project_id"
```
*(Press `Ctrl+O`, `Enter`, then `Ctrl+X` to save and exit).*

---

## Step 5: Configure Backend Systemd Service

Create a systemd service so FastAPI starts automatically on boot:

```bash
sudo nano /etc/systemd/system/portfolioai-backend.service
```

Paste the following service definition:
```ini
[Unit]
Description=PortfolioAI FastAPI Backend Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/PortfoliaAI/backend
ExecStart=/var/www/PortfoliaAI/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolioai-backend
sudo systemctl start portfolioai-backend
Press q on your keyboard to exit that screen!

# Check status
sudo systemctl status portfolioai-backend
```

---

## Step 6: Deploy Frontend (Next.js)

```bash
cd /var/www/PortfoliaAI/frontend

# Create environment configuration for Next.js
nano .env.production
```

Paste environment variables (replace with your server IP / domain):
```env
NEXT_PUBLIC_API_URL=http://YOUR_EC2_PUBLIC_IP/api
```

Install packages and build the Next.js production bundle:
```bash
npm install
npm run build

# Start Next.js with PM2
pm2 start npm --name "portfolioai-frontend" -- start

# Configure PM2 to auto-start on server reboot
pm2 startup
# (Run the command output printed by pm2 startup)
pm2 save
```

---

## Step 7: Configure Nginx Reverse Proxy

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/portfolioai
```

Paste the Nginx server block:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP yourdomain.com www.yourdomain.com;

    # Client upload size limit for PDF/DOCX resumes
    client_max_body_size 25M;

    # Frontend Next.js Proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend FastAPI Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable Nginx configuration and test syntax:
```bash
sudo ln -s /etc/nginx/sites-available/portfolioai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 8: Enable SSL (HTTPS) with Free Certbot (Optional Domain)

If you pointed a domain name to your EC2 Public IP address:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically issue an SSL certificate and update your Nginx configuration to force HTTP -> HTTPS redirect.

---

## 🎯 Verification

1. Open your browser and navigate to `http://YOUR_EC2_PUBLIC_IP` (or `https://yourdomain.com`).
2. Test creating an account, uploading a resume, generating a portfolio, and managing user portfolios on the dashboard.
