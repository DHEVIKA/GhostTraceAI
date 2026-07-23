"""
GhostTrace AI - SigNoz Telemetry Generator
Run this script to continuously emit OpenTelemetry traces, logs, and metrics to SigNoz.
This ensures your SigNoz Explorer queries (service.name in ['ghosttrace-ai']) always show rich, live data!
"""
import time
import random
import sys
from app.telemetry.tracing import (
    emit_telemetry_event,
    request_counter,
    latency_histogram,
    token_counter,
    flush_telemetry,
    app_logger,
)

def run_continuous_generator(interval: float = 1.0, total_events: int = 0):
    print("=" * 65)
    print("GhostTrace AI - SigNoz Live Telemetry Engine")
    print("Target Service: ghosttrace-ai")
    print("Target Environment: development")
    print("Target Endpoints: 127.0.0.1:4318 (HTTP) & 127.0.0.1:4317 (gRPC)")
    print("Sending live traces, logs, and metrics to SigNoz...")
    print("Press Ctrl+C to stop.")
    print("=" * 65)

    severity_levels = ["INFO", "DEBUG", "WARN", "ERROR"]
    incidents = ["healthy", "slow_api", "vector_failure", "token_spike", "hallucination"]
    tools = ["Knowledge API", "VectorDB", "TraceAnalyzer", "LogCorrelator"]

    count = 0
    try:
        while True:
            count += 1
            level = random.choice(severity_levels)
            incident = random.choice(incidents)
            tool = random.choice(tools)
            case_id = f"CASE-{random.randint(1000, 9999)}"
            tokens = random.randint(250, 3200)
            latency = round(random.uniform(0.08, 2.15), 3)

            # Record metrics
            request_counter.add(1, {"service.name": "ghosttrace-ai", "incident": incident, "severity": level})
            latency_histogram.record(latency, {"service.name": "ghosttrace-ai", "incident": incident})
            token_counter.add(tokens, {"service.name": "ghosttrace-ai", "model": "Gemini 2.5 Flash"})

            # Emit Telemetry Event
            msg = f"GhostTrace AI Investigation {case_id} [{incident.upper()}] processed via {tool} - {tokens} tokens, {latency}s latency"
            emit_telemetry_event(
                name=f"investigation-{incident}",
                level=level,
                message=msg,
                attributes={
                    "case_id": case_id,
                    "user.query": f"Automated root cause analysis for {incident} on {tool}",
                    "incident": incident,
                    "tool.name": tool,
                    "llm.model": "Gemini 2.5 Flash",
                    "llm.total_tokens": tokens,
                    "latency_s": latency,
                    "deployment.environment": "development",
                    "severity_text": level,
                },
            )

            print(f"[{time.strftime('%H:%M:%S')}] Emitted #{count}: Level={level:<5} | Incident={incident:<15} | Case={case_id}")
            flush_telemetry()

            if total_events > 0 and count >= total_events:
                print(f"\nFinished emitting {total_events} telemetry events.")
                break

            time.sleep(interval)
    except KeyboardInterrupt:
        print("\nTelemetry generator stopped by user.")
        flush_telemetry()

if __name__ == "__main__":
    count_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    run_continuous_generator(interval=1.0, total_events=count_arg)
