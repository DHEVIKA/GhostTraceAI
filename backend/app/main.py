from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.executive_report import generate_executive_report
from app.services.agent_workflow import (
    run_ai_workflow,
    generate_demo_investigations,
)
from app.services.investigation_service import generate_report
from app.services.storage import investigations
from app.services.comparison_service import compare_investigations
from app.telemetry.tracing import (
    tracer,
    app_logger,
    flush_telemetry,
    emit_telemetry_event,
    start_background_telemetry,
)
from app.services.copilot import generate_copilot_answer
from app.services.storage import (
    investigations,
    save_investigations
)
from app.services.investigation_memory import InvestigationMemory

memory = InvestigationMemory()

import logging

from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter

# ==========================================
# FastAPI App
# ==========================================

app = FastAPI(
    title="GhostTrace AI",
    description="AI Investigation Engine powered by SigNoz",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Startup & Request Logging
# ==========================================

@app.on_event("startup")
async def on_startup():
    """Emit startup telemetry and start background engine so SigNoz is always live."""
    emit_telemetry_event(
        name="backend-startup",
        level="INFO",
        message="GhostTrace AI backend started — SigNoz OTLP dual telemetry active.",
        attributes={"service.name": "ghosttrace-ai", "deployment.environment": "development"}
    )
    start_background_telemetry()
    flush_telemetry()


from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest
from starlette.responses import Response as StarletteResponse

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every HTTP request with method, path, and status code to SigNoz."""
    async def dispatch(self, request: StarletteRequest, call_next):
        import time as _time
        t0 = _time.perf_counter()
        response: StarletteResponse = await call_next(request)
        duration_ms = round((_time.perf_counter() - t0) * 1000, 2)
        emit_telemetry_event(
            name="http-request",
            level="INFO",
            message=f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)",
            attributes={
                "http.method": request.method,
                "http.path": request.url.path,
                "http.status_code": response.status_code,
                "http.duration_ms": duration_ms,
            }
        )
        return response

app.add_middleware(RequestLoggingMiddleware)

# ==========================================
# Request Model
# ==========================================

class AgentRequest(BaseModel):
    user_query: str
class CopilotRequest(BaseModel):
    case_id: str
    question: str

# ==========================================
# Health Check
# ==========================================

@app.get("/")
def home():

    with tracer.start_as_current_span("ghosttrace-home") as span:

        span.set_attribute("project", "GhostTrace")
        span.set_attribute("module", "Backend")
        span.set_attribute("feature", "Health Check")

        from app.telemetry.tracing import app_logger
        return {
            "service": "GhostTrace",
            "status": "healthy",
            "version": "1.0.0",
        }


@app.get("/debug/logs")
def debug_logs():
    """Emit test telemetry across INFO, DEBUG, WARN, ERROR levels to verify SigNoz."""
    import time
    test_msg = f"GhostTrace AI debug log emitted at {time.time()}"
    emit_telemetry_event("debug-log-info", "INFO", f"INFO level: {test_msg}")
    emit_telemetry_event("debug-log-debug", "DEBUG", f"DEBUG level: {test_msg}")
    emit_telemetry_event("debug-log-warn", "WARN", f"WARN level: {test_msg}")
    emit_telemetry_event("debug-log-error", "ERROR", f"ERROR level: {test_msg}")
    flush_telemetry()
    return {"status": "logs_emitted", "message": test_msg, "severity_texts": ["INFO", "DEBUG", "WARN", "ERROR"]}

# ==========================================
# AI Agent Workflow
# ==========================================

@app.post("/agent")
def run_agent(request: AgentRequest):

    with tracer.start_as_current_span("ghosttrace-investigation") as span:

        span.set_attribute(
            "investigation.type",
            "AI Agent Workflow"
        )

        span.set_attribute(
            "user.query",
            request.user_query
        )


        result = run_ai_workflow(
            request.user_query
        )

        # Preserve investigation history and append each new investigation.
        investigations.append(result)
        save_investigations(investigations)

        return result

# ==========================================
# Investigation History
# ==========================================

@app.get("/investigations")
def investigations_list():
    return investigations

# ==========================================
# AI Investigation Report
# ==========================================

@app.get("/investigation/{case_id}")
def investigation_report(case_id: str):

    for investigation in investigations:
        if investigation["case_id"] == case_id:
            return generate_report(investigation)

    return {
        "error": "Investigation not found"
    }


# ==========================================
# AI Copilot
# ==========================================

@app.post("/copilot")
def ai_copilot(request: CopilotRequest):

    investigation = None


    for item in investigations:
        if item["case_id"] == request.case_id:
            investigation = item
            break


    if investigation is None:
        return {
            "answer": "Investigation not found."
        }


    # Save user message

    memory.add_message(
        request.case_id,
        "user",
        request.question
    )


    history = memory.get_history(
        request.case_id
    )


    context = f"""

Investigation Details:

Case ID:
{investigation['case_id']}

Latency:
{investigation['latency']}

Confidence:
{investigation['confidence']}%

Tokens:
{investigation['total_tokens']}

Model:
{investigation['model']}


Conversation History:

{history}


User Question:

{request.question}

"""


    answer = generate_copilot_answer(
    investigation,
    request.question,
    history
)

    memory.add_message(
        request.case_id,
        "assistant",
        answer
    )


    return {
        "answer": answer,
        "history": history
    }


@app.get("/compare/{case1}/{case2}")
def compare(case1:str, case2:str):

    first=None
    second=None


    for item in investigations:

        if item["case_id"] == case1:
            first=item

        if item["case_id"] == case2:
            second=item


    if not first or not second:

        return {
            "error":"Investigation not found"
        }


    return compare_investigations(
        first,
        second
    )

@app.get("/executive-report")
def executive_report():
    return generate_executive_report(investigations)

@app.get("/executive-report/{case_id}")
def executive_report_for_case(case_id: str):

    for investigation in investigations:

        if investigation["case_id"] == case_id:

            return generate_executive_report(
                [investigation]
            )

    return {
        "error": "Investigation not found"
    }

@app.post("/simulate/healthy")
def simulate_healthy():

    result = run_ai_workflow(
        "Healthy AI Investigation",
        "healthy",
    )

    investigations.clear()
    investigations.append(result)
    save_investigations(investigations)

    return result


@app.post("/simulate/slow")
def simulate_slow():

    result = run_ai_workflow(
        "Slow API Investigation",
        "slow_api",
    )

    investigations.clear()
    investigations.append(result)
    save_investigations(investigations)

    return result


@app.post("/simulate/tool-failure")
def simulate_tool_failure():

    result = run_ai_workflow(
        "Knowledge API Failure",
        "vector_failure",
    )

    investigations.clear()
    investigations.append(result)
    save_investigations(investigations)

    return result


@app.post("/simulate/hallucination")
def simulate_hallucination():

    result = run_ai_workflow(
        "Hallucination Investigation",
        "hallucination",
    )

    investigations.clear()
    investigations.append(result)
    save_investigations(investigations)

    return result


@app.post("/simulate/token-spike")
def simulate_token_spike():

    result = run_ai_workflow(
        "High Token Consumption",
        "token_spike",
    )

    investigations.clear()
    investigations.append(result)
    save_investigations(investigations)

    return result


@app.post("/simulate/demo-data")
def simulate_demo_data():
    """Generate demo investigations and replace the current investigations list.

    Previously this inserted demo data at the front which caused the dashboard
    to keep growing. Replace the list so the UI shows the demo data from scratch.
    """
    demo_cases = generate_demo_investigations(50)
    # Replace existing investigations with demo set
    investigations.clear()
    investigations.extend(demo_cases)
    save_investigations(investigations)
    return demo_cases


from fastapi import Request


@app.post("/investigations/reset")
async def reset_investigations(request: Request):
    """Replace the investigations store with the provided payload.

    Accepts either a single investigation object or a list of investigations.
    """
    payload = await request.json()

    # If a single object is provided, wrap it in a list
    if isinstance(payload, dict):
        new_list = [payload]
    elif isinstance(payload, list):
        new_list = payload
    else:
        return {"error": "Invalid payload for reset. Provide object or list."}

    # Replace server-side investigations and persist
    investigations.clear()
    investigations.extend(new_list)
    save_investigations(investigations)

    return investigations