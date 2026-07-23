# 👻 GhostTrace AI


### AI Investigation & Observability Platform

**GhostTrace AI** is an enterprise-grade AI investigation platform that combines **OpenTelemetry**, **SigNoz**, and a **multi-agent investigation engine** to automatically trace, analyze, replay, and explain AI workflows.

Instead of searching through logs, GhostTrace AI reconstructs the entire execution flow, identifies failures, measures latency, tracks token usage, estimates AI cost, and generates executive investigation reports.

Built for the **Agents of SigNoz Hackathon 2026** 🚀

</div>

---

# 📌 Table of Contents

- Overview
- Features
- Architecture
- Technology Stack
- Multi-Agent Workflow
- Dashboard
- Project Structure
- Installation
- Running the Project
- Telemetry Flow
- API Endpoints
- Screenshots
- Future Improvements
- Contributors
- License

---

# 🚀 Overview

Modern AI applications consist of multiple agents, tools, APIs, and reasoning steps.

Debugging them using traditional logs is difficult because developers cannot easily answer:

- Which AI agent failed?
- Which tool increased latency?
- Where did the error originate?
- How many tokens were consumed?
- How much did the request cost?
- What happened during execution?

GhostTrace AI solves this problem by providing complete AI observability and investigation.

Every request becomes an investigation that can be replayed step-by-step.

---

# ✨ Features

## AI Investigation

- AI Investigation Replay
- Executive Investigation Reports
- Root Cause Detection
- Confidence Scoring
- Severity Classification
- Business Impact Analysis

---

## Observability

- Distributed Tracing
- OpenTelemetry Native
- Metrics Collection
- Span Waterfall
- Token Analytics
- Cost Tracking
- Latency Monitoring

---

## AI Analytics

- AI Health Score
- Average Latency
- Investigation Statistics
- Token Usage
- AI Cost Estimation
- Success Rate
- Slow Tool Detection

---

## Multi-Agent Engine

GhostTrace AI simulates a production AI pipeline consisting of:

- Planner Agent
- Knowledge Agent
- Guardian Agent
- Validator Agent
- Summarizer Agent

Each agent execution is automatically traced using OpenTelemetry.

---

# 🏗 Architecture

```
                User
                  │
                  ▼
        React Dashboard
                  │
                  ▼
           FastAPI Backend
                  │
                  ▼
     GhostTrace Investigation Engine
                  │
    ┌─────────────┴─────────────┐
    ▼                           ▼
Planner Agent             Knowledge Agent
    ▼                           ▼
Guardian Agent          Validator Agent
    ▼                           ▼
          Summarizer Agent
                  │
                  ▼
         OpenTelemetry SDK
                  │
                  ▼
          OTLP Collector
                  │
                  ▼
             Self-hosted SigNoz
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   ClickHouse          PostgreSQL
```

---

# ⚙ Technology Stack

## Frontend

- React
- TypeScript
- TailwindCSS
- Vite
- Axios
- Chart.js

---

## Backend

- FastAPI
- Python
- Uvicorn
- Pydantic

---

## AI

- Gemini 2.5 Flash

---

## Observability

- OpenTelemetry
- OTLP
- SigNoz
- ClickHouse
- PostgreSQL

---

## Deployment

- Docker
- Docker Compose
- Linux

---

# 🤖 Multi-Agent Workflow

GhostTrace AI processes every request through five AI agents.

### Planner Agent

- Understands user intent
- Decomposes request
- Creates execution plan

---

### Knowledge Agent

- Retrieves context
- Searches documentation
- Queries vector memory

---

### Guardian Agent

- Executes tools
- Performs safety checks
- Monitors latency

---

### Validator Agent

- Evaluates AI response
- Detects hallucinations
- Computes confidence score

---

### Summarizer Agent

Produces

- Executive Summary
- Root Cause
- Recommendations
- Business Impact
- AI Confidence

---

# 📡 Telemetry Flow

Every AI request automatically generates

- Spans
- Metrics
- Logs
- Events

using OpenTelemetry.

Telemetry is exported via OTLP to SigNoz for visualization and analysis.

---

# 📊 Dashboard

GhostTrace AI dashboard includes

✅ AI Health Score

✅ Investigation Cases

✅ Investigation Replay

✅ Executive Summary

✅ Root Cause Analysis

✅ Trace Explorer

✅ AI Analytics

✅ Cost Dashboard

✅ Token Usage

✅ Latency Charts

---

# 📂 Project Structure

```
GhostTraceAI
│
├── backend
│   ├── main.py
│   ├── agents
│   ├── telemetry
│   ├── services
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   └── types
│
├── deployment
│   └── docker-compose.yml
│
├── screenshots
│
└── README.md
```

---

# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/GhostTraceAI.git

cd GhostTraceAI
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## SigNoz

Start SigNoz

```bash
foundryctl start
```

or

```bash
docker compose up -d
```

---

# 📈 Running

Backend

```
http://localhost:8000
```

Frontend

```
http://localhost:5173
```

SigNoz

```
http://localhost:8080
```

---

# 🔗 API Endpoints

## Investigations

```
GET /investigations
```

Returns all investigations.

---

## Investigation Report

```
GET /investigation/{case_id}
```

Returns

- Root Cause
- Severity
- Confidence
- Recommendations

---

## Executive Report

```
GET /executive-report
```

Returns executive AI report.

---

# 📷 Screenshots

## Dashboard

<img width="1895" height="872" alt="Dashboard" src="https://github.com/user-attachments/assets/78c03b6a-4336-4d4e-9005-a2e5caa563ac" />




---

## AI Investigation Replay

<img width="772" height="496" alt="AI Investigation Replay" src="https://github.com/user-attachments/assets/3b6796f5-fb9d-4ce5-9190-4f3f28796dd6" />

---

## Executive Report

<img width="1917" height="725" alt="Executive Report" src="https://github.com/user-attachments/assets/5c9e9b0e-e44e-4fcd-8409-c830019ae187" />


---

## Architecture

<img width="540" height="691" alt="Architecture1" src="https://github.com/user-attachments/assets/44c0953c-7186-47c8-939f-0a8fd1b0d6e6" />

<img width="792" height="506" alt="Architecture2" src="https://github.com/user-attachments/assets/dcf86597-08a1-4332-967f-1f56b58e296e" />

---

# 🌟 Highlights

- OpenTelemetry Native
- Self-hosted SigNoz
- AI Investigation Replay
- Executive Reports
- Root Cause Analysis
- Multi-Agent Workflow
- Token Analytics
- AI Cost Tracking
- Enterprise Dashboard
- Production-style Architecture

---

# 🚀 Future Improvements

- Kubernetes Deployment
- Role-Based Authentication
- Live Streaming Investigations
- AI Anomaly Detection
- Predictive Incident Analysis
- Slack & Microsoft Teams Integration
- Multi-LLM Support
- Vector Database Integration
- Real-time Alerts

---

# 👨‍💻 Contributors

**Dhevika M.**

B.Tech Information Technology

Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College

---

# 🙏 Acknowledgements

- OpenTelemetry
- SigNoz
- FastAPI
- React
- Gemini API
- WeMakeDevs
- Agents of SigNoz Hackathon

---

### ⭐ If you found this project interesting, consider giving it a Star ⭐

Built with ❤️ using OpenTelemetry, SigNoz and FastAPI.

</div>
