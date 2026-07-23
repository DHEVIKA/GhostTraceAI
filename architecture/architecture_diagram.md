# GhostTrace AI — System Architecture & Telemetry Pipeline

GhostTrace AI is an AI Investigation & Observability Engine powered by OpenTelemetry (OTLP) and SigNoz. It provides automated root cause analysis, trace correlation, and agentic workflow monitoring.

---

## 🏗️ High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client_Tier ["🖥️ Client & Visualization Layer"]
        UI["React + Vite Frontend\n(Port 5173)"]
        SigNozUI["SigNoz Dashboard & Explorer\n(Port 3301 / 8080)"]
    end

    subgraph Backend_Tier ["⚙️ GhostTrace AI Engine (FastAPI - Port 8000)"]
        API["FastAPI REST API\n(/agent, /copilot, /simulate)"]
        MW["Request Logging Middleware"]
        
        subgraph Agent_Workflow ["🤖 Agentic Workflow Orchestrator"]
            Planner["🧠 Planner Agent"]
            MemSearch["🔍 Memory Search (VectorDB)"]
            ToolCall["🛠️ Knowledge API Tool Call"]
            LLM["🤖 Gemini 2.5 Flash LLM"]
            Validator["🛡️ Response Validator"]
        end
        
        BGTicker["🔄 Background Telemetry Engine\n(3s Periodic Heartbeat)"]
    end

    subgraph OTEL_Pipeline ["📡 OpenTelemetry SDK Pipeline (ghosttrace-ai)"]
        TP["Tracer Provider\n(Spans & Trace IDs)"]
        LP["Logger Provider\n(INFO, DEBUG, WARN, ERROR)"]
        MP["Meter Provider\n(Request, Latency, Tokens)"]
    end

    subgraph SigNoz_Stack ["📊 SigNoz Telemetry Stack"]
        OTLP_HTTP["OTLP HTTP Receiver\n(Port 4318)"]
        OTLP_GRPC["OTLP gRPC Receiver\n(Port 4317)"]
        ClickHouse[("Database\nClickHouse Storage")]
        QueryEngine["SigNoz Query & Filter Engine\n(service.name = 'ghosttrace-ai')"]
    end

    %% Flow Connections
    UI -->|REST Calls| API
    API --> MW
    MW --> Agent_Workflow
    
    Planner --> MemSearch
    MemSearch --> ToolCall
    ToolCall --> LLM
    LLM --> Validator

    Agent_Workflow -->|Spans| TP
    Agent_Workflow -->|Logs| LP
    Agent_Workflow -->|Metrics| MP
    BGTicker -->|Live Heartbeat| TP & LP & MP

    TP -->|HTTP / v1 / traces| OTLP_HTTP
    LP -->|HTTP / v1 / logs| OTLP_HTTP
    MP -->|HTTP / v1 / metrics| OTLP_HTTP

    TP -.->|gRPC / 4317| OTLP_GRPC
    LP -.->|gRPC / 4317| OTLP_GRPC

    OTLP_HTTP --> ClickHouse
    OTLP_GRPC --> ClickHouse
    ClickHouse --> QueryEngine
    QueryEngine --> SigNozUI
```

---

## 🧩 Component Breakdown

### 1. **Client & Presentation Layer**
- **GhostTrace React Dashboard**: Interactive UI for running AI investigations, comparing cases, viewing execution timelines, and launching copilot sessions.
- **SigNoz Explorer**: Real-time observability dashboard for searching logs (`service.name in ['ghosttrace-ai']`), inspecting span waterfalls, and monitoring frequency charts.

### 2. **GhostTrace AI Core Engine (`ghosttrace-ai`)**
- **FastAPI Framework**: High-performance REST endpoints handling agent requests, simulation scenarios (`healthy`, `slow_api`, `vector_failure`, `token_spike`, `hallucination`), and executive reporting.
- **Agentic Workflow Pipeline**:
  - **Planner**: Generates investigation plan and initializes trace context (`ghosttrace.case_id`, `ghosttrace.session_id`).
  - **Memory Search**: Simulates vector document retrieval and logs document counts.
  - **Knowledge API**: Simulates tool calls, measuring latency and error states.
  - **Gemini LLM**: Calculates prompt/response token usage, model inference time, and cost in USD.
  - **Response Validator**: Scores output confidence percentage, assigns severity (`Low`, `Medium`, `High`, `Critical`), and validates safety.
- **Live Telemetry Engine**: Asynchronous background ticker emitting telemetry every 3 seconds to guarantee SigNoz time-window queries (`5m`, `15m`) remain active.

### 3. **OpenTelemetry (OTLP) Telemetry Pipeline**
- **Service Name**: `ghosttrace-ai`
- **Environment**: `development`
- **Exporters**: Dual OTLP Exporters over HTTP (`http://127.0.0.1:4318`) & gRPC (`http://127.0.0.1:4317`).
- **Log Severity Normalization**: Automatic mapping of standard Python logging levels to SigNoz UI filters (`INFO`, `DEBUG`, `WARN`, `ERROR`).
- **Metrics Tracked**:
  - `ghosttrace_requests_total`: Counter by incident type and severity level.
  - `ghosttrace_latency_seconds`: Histogram of total workflow duration.
  - `ghosttrace_tokens_total`: Total LLM token usage counter.

---

## 🔄 End-to-End Data Flow Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Judge
    participant UI as React UI
    participant Backend as FastAPI Backend
    participant Agent as Agent Workflow
    participant OTEL as OTEL SDK
    participant SigNoz as SigNoz Collector & UI

    User->>UI: Submit Query / Trigger Simulation
    UI->>Backend: POST /agent or POST /simulate/*
    Backend->>OTEL: Start root span (ghosttrace-investigation)
    Backend->>Agent: Execute Planner -> Memory -> Tool -> LLM -> Validator
    Agent->>OTEL: Record sub-spans, tokens, cost & logs (INFO/WARN/ERROR)
    OTEL->>SigNoz: Export OTLP Payloads (HTTP 4318 / gRPC 4317)
    Backend-->>UI: Return JSON Investigation Report
    User->>SigNoz: Filter service.name = 'ghosttrace-ai' (Last 5m)
    SigNoz-->>User: Display Live Logs, Trace Waterfalls & Frequency Chart
```
