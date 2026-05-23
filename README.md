# Portfolio Website Deployment — Jenkins + Docker (Windows)
### Student Mini Project | Auto-Deploy on File Save

---

## How It Works

```
You edit index.html / style.css / script.js
              ↓
       watch.ps1 detects the save
              ↓
  Calls Jenkins API to trigger pipeline
              ↓
     Jenkins Pipeline (in Docker):
       Stage 1 → Build Docker image
       Stage 2 → Stop old container
       Stage 3 → Deploy new container
       Stage 4 → Push code to GitHub
              ↓
  Portfolio live at http://localhost:8080
  GitHub repo updated automatically
```

> **Only one tool needs to be installed on your PC: Docker Desktop.**  
> Jenkins runs inside Docker. No separate Java or Jenkins installation needed.

---

## Project Structure

```
portfolio/
├── index.html              ← Portfolio website
├── style.css               ← Styling
├── script.js               ← JavaScript
├── Dockerfile              ← Builds nginx image for the portfolio
├── Jenkinsfile             ← CI/CD pipeline (build → deploy → push to GitHub)
├── docker-compose.yml      ← Starts Jenkins in a Docker container
├── jenkins/
│   └── Dockerfile          ← Custom Jenkins image (with Docker CLI + Git)
├── watch.ps1               ← Watches files → auto-triggers Jenkins
└── README.md               ← This file
```

---

## Documentation

### Abstract
This project demonstrates a fully automated DevOps pipeline for a student portfolio website.
The developer edits HTML/CSS/JS files on Windows. A PowerShell watcher script detects the
save and triggers Jenkins, which runs inside Docker. Jenkins builds a Docker image, deploys
the website, and pushes the code to GitHub — all automatically. The only software needed on
the Windows machine is **Docker Desktop**.

### Introduction
Modern software teams use CI/CD pipelines to automatically test and deploy code. This project
simulates that workflow in a beginner-friendly way using:
- **Docker Desktop** — runs all services as containers
- **Jenkins** — automation server that runs the pipeline
- **Nginx** — serves the static portfolio website inside a container
- **GitHub** — stores the code remotely

### Problem Statement
Manual deployment is slow and error-prone. Every time a developer changes a file, they must
rebuild, stop the old server, and restart — all by hand. This project automates every step
so the developer only needs to save the file.

### Objectives
1. Build a clean portfolio website (HTML/CSS/JS)
2. Run Jenkins entirely inside Docker (no host installation)
3. Auto-trigger Jenkins when portfolio files are saved
4. Deploy the website using Docker + Nginx
5. Automatically push updated code to GitHub after every deploy

### Methodology

| Step | What Happens                                  | Tool           |
|------|-----------------------------------------------|----------------|
| 1    | Developer saves a file                         | VS Code / any editor |
| 2    | File change is detected                        | watch.ps1      |
| 3    | Jenkins pipeline is triggered via REST API     | watch.ps1      |
| 4    | Docker image is built from portfolio files     | Jenkins + Docker |
| 5    | Old container is stopped, new one started      | Jenkins + Docker |
| 6    | Code is committed and pushed to GitHub         | Jenkins + Git  |

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│           Windows PC (Host)             │
│                                         │
│  ┌────────────┐    saves    ┌─────────┐ │
│  │  VS Code   │ ──────────► │  Files  │ │
│  └────────────┘             └────┬────┘ │
│                                  │      │
│  ┌────────────────────────────────▼───┐ │
│  │     watch.ps1 (PowerShell)         │ │
│  │  Detects .html/.css/.js changes    │ │
│  └────────────────────┬───────────────┘ │
│                       │ HTTP POST       │
│  ┌────────────────────▼───────────────┐ │
│  │  Jenkins Container (port 8090)     │ │
│  │  ┌──────────────────────────────┐  │ │
│  │  │  Pipeline Stages:            │  │ │
│  │  │  1. docker build             │  │ │
│  │  │  2. docker stop (old)        │  │ │
│  │  │  3. docker run (new)         │  │ │
│  │  │  4. git push → GitHub        │  │ │
│  │  └──────────────────────────────┘  │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Portfolio Container (port 8080)│   │
│  │  Nginx serving index.html       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    │ git push
                    ▼
              ┌──────────┐
              │  GitHub  │
              └──────────┘
```

### Advantages
- ✅ Only Docker Desktop needed — no separate installs
- ✅ Auto-deploy on every file save
- ✅ GitHub always stays in sync automatically
- ✅ Clean and reproducible Docker environments
- ✅ Beginner-friendly — one command to start everything

### Limitations
- ❌ Docker Desktop must be running at all times
- ❌ No HTTPS in this basic setup
- ❌ watch.ps1 must be running in a terminal during development
- ❌ Single-machine setup — not production-scale

### Future Scope
- Add GitHub Webhooks to replace watch.ps1 (fully server-side)
- Use Docker Compose for a multi-container app (frontend + backend)
- Add automated tests (HTML validation, broken link checker)
- Deploy to cloud (AWS EC2 / Azure VM)
- Add Kubernetes for container orchestration

### Conclusion
This project gives students hands-on experience with real DevOps tools. By running Jenkins in
Docker, the setup is simple (one command), portable, and clean. The auto-deploy watcher makes
the feedback loop instant — save a file, see it live in seconds.

---

## Setup Guide — Step by Step

---

### Step 1 — Install Docker Desktop (only requirement)

1. Download from: https://www.docker.com/products/docker-desktop/
2. Run the installer → restart your PC when prompted
3. Open **Docker Desktop** from the Start Menu
4. Wait until the whale icon in the taskbar is **green**
5. Verify in PowerShell:
```powershell
docker --version
docker compose version
```

---

### Step 2 — Initialize Git and Connect to GitHub

Open PowerShell in the `portfolio` folder:

```powershell
cd f:\devops\portfolio

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> Create the GitHub repository first at github.com → New → Create Repository.  
> Use a **Personal Access Token** as your password:  
> GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token (classic) → select `repo` scope.

---

### Step 3 — Edit Jenkinsfile

Open `Jenkinsfile` and update your GitHub username on line 8:

```groovy
GITHUB_USER = 'YOUR_GITHUB_USERNAME'   // ← put your actual username here
GITHUB_REPO = 'portfolio'              // ← your repo name (if different)
```

---

### Step 4 — Start Jenkins with Docker Compose

```powershell
cd C:\devops\portfolio

docker compose up -d
```

This command:
- Builds the custom Jenkins image (includes Docker CLI + Git)
- Starts Jenkins in the background
- Takes 2–3 minutes on first run (downloading the image)

Check it's running:
```powershell
docker ps
```

You should see a container named `jenkins`.

---

### Step 5 — Unlock Jenkins

1. Open your browser: `http://localhost:8090`
2. Get the unlock password:
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
3. Paste the password → click **Install suggested plugins** → wait for install
4. Create an admin user → click **Save and Finish**

---

### Step 6 — Add GitHub Credentials to Jenkins

Jenkins needs your GitHub token to push code.

1. Go to: **Manage Jenkins → Credentials → (global) → Add Credentials**
2. Fill in:
   - **Kind:** Username with password
   - **Username:** your GitHub username
   - **Password:** your GitHub Personal Access Token
   - **ID:** `github-credentials` ← must match this exactly
3. Click **Save**

---

### Step 7 — Create the Jenkins Pipeline

1. Click **New Item** → name it `portfolio-pipeline` → select **Pipeline** → click OK
2. Scroll to the **Pipeline** section
3. Set **Definition:** `Pipeline script from SCM`
4. Set **SCM:** `Git`
5. Set **Repository URL:** `file:///workspace/portfolio`
6. Set **Branch:** `*/main`
7. Set **Script Path:** `Jenkinsfile`
8. Click **Save**

---

### Step 8 — Get Your Jenkins API Token

The watch.ps1 script needs this token to trigger builds.

1. In Jenkins, click your username (top right) → **Configure**
2. Scroll to **API Token** → click **Add new Token**
3. Name it `watch-token` → click **Generate**
4. **Copy the token** (you won't see it again)

---

### Step 9 — Configure watch.ps1

Open `watch.ps1` and fill in your token at the top:

```powershell
$JENKINS_USER  = "admin"           # your Jenkins username
$JENKINS_TOKEN = "YOUR_API_TOKEN"  # paste the token from Step 8
```

---

### Step 10 — Start the Watcher

```powershell
cd C:\devops\portfolio
.\watch.ps1
```

You will see:
```
╔══════════════════════════════════════════════╗
║   Portfolio Auto-Deploy Watcher              ║
╚══════════════════════════════════════════════╝
✅ Watcher is active. Edit and save any .html / .css / .js file to auto-deploy.
```

---

### Step 11 — Test the Full Flow

1. Open `index.html` in VS Code (or any editor)
2. Change something — e.g. update your name or add a line
3. Save the file (`Ctrl+S`)
4. Watch the terminal — you will see:
```
[15:32:10] 📝 Change detected: index.html
  → Triggering Jenkins pipeline...
  ✅ Jenkins build triggered!
  👉 Watch progress: http://localhost:8090/job/portfolio-pipeline
```
5. Open `http://localhost:8090/job/portfolio-pipeline` to watch the pipeline run
6. When all 4 stages are green, open `http://localhost:8080` — your changes are live!
7. Check your GitHub repo — the code was pushed automatically.

---

## Daily Workflow (After Setup)

Every time you start working:
```powershell
# 1. Start Jenkins (if not already running)
docker compose up -d

# 2. Start the file watcher (in a separate PowerShell window)
cd C:\devops\portfolio
.\watch.ps1
```

Then just edit and save files — everything else is automatic.

---

## Useful Commands

```powershell
# Start Jenkins container
docker compose up -d

# Stop Jenkins container
docker compose down

# View Jenkins logs
docker logs jenkins

# View portfolio container logs
docker logs portfolio-container

# Rebuild Jenkins image (after changes to jenkins/Dockerfile)
docker compose build

# Check running containers
docker ps

# Stop and remove portfolio container manually
docker stop portfolio-container
docker rm portfolio-container
```

---

## Troubleshooting

### Docker Desktop not running
**Error:** `Cannot connect to the Docker daemon`  
**Fix:** Open Docker Desktop from the Start Menu. Wait for the green whale icon.

---

### Port 8080 already in use
**Error:** `port is already allocated`
```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Stop the conflicting Docker container
docker stop portfolio-container
docker rm portfolio-container
```

---

### Jenkins not opening at localhost:8090
```powershell
# Check if Jenkins container is running
docker ps

# If not running, start it
docker compose up -d

# Check for startup errors
docker logs jenkins
```

---

### watch.ps1 shows "Could not reach Jenkins"
- Make sure Jenkins is running: `docker ps`
- Make sure the API token in watch.ps1 is correct
- Make sure the Job name is exactly `portfolio-pipeline`

---

### Pipeline fails at "Push to GitHub"
- Make sure credentials ID in Jenkins is exactly `github-credentials`
- Make sure your GitHub Personal Access Token has `repo` scope
- Make sure `GITHUB_USER` and `GITHUB_REPO` in Jenkinsfile are correct

---

### watch.ps1 blocked by PowerShell execution policy
```powershell
# Run this once to allow local scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Tech Stack

| Tool              | Purpose                              | Runs On     |
|-------------------|--------------------------------------|-------------|
| HTML / CSS / JS   | Portfolio website                    | Browser     |
| Nginx             | Web server inside portfolio container| Docker      |
| Docker Desktop    | Runs all containers                  | Windows Host|
| Jenkins           | CI/CD pipeline automation            | Docker      |
| Git               | Version control (inside Jenkins)     | Docker      |
| watch.ps1         | File watcher → Jenkins trigger       | PowerShell  |
| GitHub            | Remote code repository               | Cloud       |

---

*Student Mini Project — DevOps with Jenkins and Docker on Windows*
