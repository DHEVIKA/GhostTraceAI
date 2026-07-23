import random
import time
import uuid
import logging

from app.telemetry.tracing import tracer, flush_telemetry, emit_telemetry_event
logger = logging.getLogger(__name__)


def format_timestamp(timestamp: float) -> str:
    return time.strftime("%H:%M:%S", time.localtime(timestamp)) + f".{int((timestamp % 1) * 1000):03d}"


def build_investigation(
    user_query: str,
    incident: str,
    apply_sleep: bool = True,
):
    case_id = f"CASE-{random.randint(1000, 9999)}"
    session_id = str(uuid.uuid4())

    with tracer.start_as_current_span("planner") as span:
        trace_id = format(
            span.get_span_context().trace_id,
            "032x",
        )

        planner_duration = random.randint(150, 300)
        planner_start = time.time()
        planner_end = planner_start + planner_duration / 1000

        span.set_attribute("case.id", case_id)
        span.set_attribute("session.id", session_id)
        span.set_attribute("user.query", user_query)
        span.set_attribute("agent.role", "Planner")
        span.set_attribute("ghosttrace.case_id", case_id)
        span.set_attribute("ghosttrace.session_id", session_id)
        span.set_attribute("ghosttrace.agent", "Planner")
        span.set_attribute("ghosttrace.stage", "Planning")

        logger.info(f"GhostTrace AI Planner started investigation case_id={case_id} session_id={session_id} query='{user_query}'")

        if apply_sleep:
            time.sleep(planner_duration / 1000)

    with tracer.start_as_current_span("memory-search") as span:
        docs = random.randint(4, 15)
        memory_duration = random.randint(200, 450)
        memory_start = planner_end
        memory_end = memory_start + memory_duration / 1000

        span.set_attribute("memory.documents", docs)
        span.set_attribute("memory.source", "VectorDB")
        span.set_attribute("ghosttrace.case_id", case_id)
        span.set_attribute("ghosttrace.agent", "Memory Search")
        span.set_attribute("ghosttrace.stage", "Retrieval")
        span.set_attribute("ghosttrace.vector_documents", docs)

        logger.info(f"Memory Search completed for case_id={case_id}: retrieved {docs} documents from VectorDB in {memory_duration}ms")

        if apply_sleep:
            time.sleep(memory_duration / 1000)

    with tracer.start_as_current_span("tool-call") as span:
        if incident == "healthy":
            latency = random.randint(100, 250)
            tool_status = "Healthy"
        elif incident == "slow_api":
            latency = random.randint(1800, 3000)
            tool_status = "Slow"
        elif incident == "vector_failure":
            latency = random.randint(150, 350)
            tool_status = "VectorDB Error"
        elif incident == "hallucination":
            latency = random.randint(150, 350)
            tool_status = "Healthy"
        elif incident == "token_spike":
            latency = random.randint(250, 500)
            tool_status = "Healthy"

        tool_start = memory_end
        tool_end = tool_start + latency / 1000

        span.set_attribute("tool.name", "Knowledge API")
        span.set_attribute("tool.latency_ms", latency)
        span.set_attribute("tool.status", tool_status)
        span.set_attribute("ghosttrace.case_id", case_id)
        span.set_attribute("ghosttrace.agent", "Knowledge API")
        span.set_attribute("ghosttrace.stage", "Tool Execution")
        span.set_attribute("ghosttrace.tool_status", tool_status)

        logger.info(f"Knowledge API tool call finished for case_id={case_id}: status={tool_status} latency={latency}ms")

        if apply_sleep:
            time.sleep(latency / 1000)

    with tracer.start_as_current_span("llm-call") as span:
        if incident == "healthy":
            input_tokens = random.randint(250, 350)
            output_tokens = random.randint(100, 180)
        elif incident == "token_spike":
            input_tokens = random.randint(1400, 1700)
            output_tokens = random.randint(700, 900)
        else:
            input_tokens = random.randint(400, 700)
            output_tokens = random.randint(150, 300)

        total_tokens = input_tokens + output_tokens
        token_cost = round((total_tokens / 1_000_000) * 0.35, 6)
        llm_duration = random.randint(400, 800)
        llm_start = tool_end
        llm_end = llm_start + llm_duration / 1000

        span.set_attribute("llm.provider", "Gemini")
        span.set_attribute("llm.model", "Gemini 2.5 Flash")
        span.set_attribute("llm.input_tokens", input_tokens)
        span.set_attribute("llm.output_tokens", output_tokens)
        span.set_attribute("llm.total_tokens", total_tokens)
        span.set_attribute("llm.cost_usd", token_cost)
        span.set_attribute("ghosttrace.case_id", case_id)
        span.set_attribute("ghosttrace.agent", "LLM")
        span.set_attribute("ghosttrace.model", "Gemini 2.5 Flash")
        span.set_attribute("ghosttrace.tokens", total_tokens)
        span.set_attribute("ghosttrace.cost", token_cost)
        span.set_attribute("ghosttrace.stage", "LLM")

        logger.info(f"Gemini LLM inference completed for case_id={case_id}: total_tokens={total_tokens} cost=${token_cost}")

        if apply_sleep:
            time.sleep(llm_duration / 1000)

    if incident == "healthy":
        confidence = round(random.uniform(97, 99.9), 2)
        severity = "Low"
    elif incident == "slow_api":
        confidence = round(random.uniform(92, 96), 2)
        severity = "Medium"
    elif incident == "vector_failure":
        confidence = round(random.uniform(72, 84), 2)
        severity = "Critical"
    elif incident == "hallucination":
        confidence = round(random.uniform(65, 80), 2)
        severity = "High"
    elif incident == "token_spike":
        confidence = round(random.uniform(90, 95), 2)
        severity = "Medium"

    with tracer.start_as_current_span("response-validator") as span:
        validator_status = "Needs Review" if confidence < 90 else "Approved"
        validator_duration = random.randint(100, 200)
        validator_start = llm_end
        validator_end = validator_start + validator_duration / 1000

        span.set_attribute("response.confidence", confidence)
        span.set_attribute("response.status", validator_status)
        span.set_attribute("ghosttrace.case_id", case_id)
        span.set_attribute("ghosttrace.confidence", confidence)
        span.set_attribute("ghosttrace.severity", severity)
        span.set_attribute("ghosttrace.status", validator_status)
        span.set_attribute("ghosttrace.agent", "Validator")
        span.set_attribute("ghosttrace.stage", "Validation")

        logger.info(f"Response validator completed for case_id={case_id}: confidence={confidence}% severity={severity} status={validator_status}")

        if apply_sleep:
            time.sleep(validator_duration / 1000)

    timeline = [
        {
            "step": "Planner Started",
            "icon": "🧠",
            "status": "Started",
            "timestamp": format_timestamp(planner_start),
        },
        {
            "step": "Planner Finished",
            "icon": "✅",
            "status": "Completed",
            "timestamp": format_timestamp(planner_end),
            "duration": f"{planner_duration} ms",
        },
        {
            "step": "Knowledge API",
            "icon": "🛠",
            "status": tool_status,
            "timestamp": format_timestamp(tool_start),
            "latency": f"{latency} ms",
        },
        {
            "step": "Gemini",
            "icon": "🤖",
            "status": "Completed",
            "timestamp": format_timestamp(llm_start),
            "tokens": total_tokens,
            "cost": token_cost,
            "duration": f"{llm_duration} ms",
        },
        {
            "step": "Validator",
            "icon": "✅",
            "status": validator_status,
            "timestamp": format_timestamp(validator_start),
            "confidence": confidence,
            "duration": f"{validator_duration} ms",
        },
    ]

    total_latency = (
        planner_duration
        + memory_duration
        + latency
        + llm_duration
        + validator_duration
    ) / 1000

    flush_telemetry()

    return {
        "case_id": case_id,
        "incident": incident,
        "session_id": session_id,
        "trace_id": trace_id,
        "status": "Completed",
        "confidence": confidence,
        "latency": f"{total_latency:.2f} s",
        "total_tokens": total_tokens,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "token_cost": token_cost,
        "model": "Gemini 2.5 Flash",
        "tool": "Knowledge API",
        "tool_status": tool_status,
        "severity": severity,
        "created_at": time.strftime("%d %b %Y %I:%M %p"),
        "timeline": timeline,
    }


def run_ai_workflow(
    user_query: str,
    forced_incident: str | None = None,
):
    if forced_incident is not None:
        incident = forced_incident
    else:
        incident = random.choice(
            [
                "healthy",
                "slow_api",
                "vector_failure",
                "token_spike",
                "hallucination",
            ]
        )

    return build_investigation(
        user_query,
        incident,
        apply_sleep=True,
    )


def generate_demo_investigations(count: int = 50):
    incidents = [
        "healthy",
        "slow_api",
        "vector_failure",
        "hallucination",
        "token_spike",
    ]
    demo_cases = []

    for i in range(count):
        incident = incidents[i % len(incidents)]
        demo_cases.append(
            build_investigation(
                f"Demo investigation {i + 1}",
                incident,
                apply_sleep=False,
            )
        )

    return demo_cases
