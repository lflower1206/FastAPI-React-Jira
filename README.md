# FastAPI-React-Jira Dashboard

This repository contains a full-stack web application designed to integrate and interact with Jira via API. The backend wrapper is built with Python/FastAPI, while the frontend dashboard uses React (Vite).

## Features
- **FastAPI Backend:** Handles secure authentication and wrappers around the Jira Python client.
- **Modern React Frontend:** Built with Vite, using a sleek "Glassmorphism" UI, dynamic animations, and responsive layout.
- **Jira Functionality:** View recent issues for a specific Project Key and directly create new tasks.

---

## 🛠️ 1. Backend Setup (FastAPI)

The backend provides the API layer for Jira operations to keep your Atlassian credentials hidden from the client.

### Requirements
- Python 3.8+

### Setup Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your Environment Variables:
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual Atlassian details:
     - `JIRA_SERVER`: Your Jira instance URL (e.g., `https://your-domain.atlassian.net`)
     - `JIRA_EMAIL`: Your Atlassian email address.
     - `JIRA_API_TOKEN`: Your Atlassian API Token. ([How to generate an API Token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/))

### Run the Backend Server
Start the development server with hot-reload:
```bash
uvicorn main:app --reload
```
The API will be accessible at [http://localhost:8000](http://localhost:8000). You can visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI.

---

## 🎨 2. Frontend Setup (React / Vite)

The frontend contains a beautifully styled, modern dashboard to view and create issues.

### Requirements
- Node.js (v18+)

### Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node dependencies:
   ```bash
   npm install
   ```

### Run the Frontend Server
Start the Vite development server:
```bash
npm run dev
```
The web dashboard will be available at [http://localhost:5173](http://localhost:5173).

---

## Usage
1. Make sure **both** the backend (`uvicorn`) and frontend (`npm run dev`) servers are running simultaneously.
2. Open the frontend address in your browser.
3. Use the **Project Key** field to fetch the latest issues from a specific Jira project (e.g., `PROJ`).
4. Fill out the "Create Issue" form to generate a new task directly inside your Jira workspace.