cat <<EOF > README.md
# 🚀 Scalable SSO Authentication Service

A robust **Single Sign-On (SSO)** backend built with **Node.js** and **Express**, designed to handle centralized authentication across multiple platforms. This service uses a microservice-ready architecture, leveraging **Redis** for session management/caching and **PostgreSQL** for persistent data.

### 🛠 Tech Stack
* **Runtime:** Node.js (v24-slim)
* **Framework:** Express.js
* **Database:** PostgreSQL (Primary Data Store)
* **Caching/Sessions:** Redis
* **Containerization:** Docker & Docker Compose
* **Security:** JWT (JSON Web Tokens), Bcrypt, and non-root Docker execution.

---

### 🏗 Architecture Highlights
* **Graceful Shutdown:** Implements \`SIGTERM\` handling to close database connections safely.
* **Separation of Concerns:** Distinct entry point (\`index.js\`) and application logic (\`app.js\`).
* **Security First:** Runs under a non-privileged \`node\` user inside Docker.
* **Environment Driven:** Fully configurable via \`.env\` files with support for dynamic port mapping.

---

### 🚀 Getting Started

#### 1. Prerequisites
* Docker and Docker Compose installed.
* A \`.env\` file is provided.

#### 2. Installation & Setup
\`\`\`bash
# Clone the repo
git clone https://github.com/Durvash/sso.git

# Navigate to directory
cd sso

# Start the infrastructure (Postgres & Redis)
docker compose up -d
\`\`\`

#### 3. Development Mode
\`\`\`bash
npm install
npm run dev
\`\`\`

---

### 📡 API Endpoints (Planned/Current)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`POST\` | \`/api/auth/register\` | Register a new user |
| \`POST\` | \`/api/auth/login\` | Authenticate and receive JWT |
| \`GET\` | \`/api/auth/me\` | Get current user profile (Protected) |

---

### 🔐 Security Note
This project uses \`.dockerignore\` and \`.gitignore\` to ensure sensitive information like \`node_modules\` and \`.env\` credentials are never leaked to the repository.
EOF