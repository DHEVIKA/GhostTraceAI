import asyncio
import logging
import random
import time
import atexit
from typing import Dict, Any, Optional

from opentelemetry import trace, metrics, _logs
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

# OTLP Exporters
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter as HTTPTraceExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter as GRPCTraceExporter
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter as HTTPLogExporter
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter as GRPCLogExporter
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter as HTTPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter as GRPCMetricExporter


# Define standard Resource for SigNoz
resource = Resource.create({
    "service.name": "ghosttrace-ai",
    "service.version": "1.0.0",
    "deployment.environment": "development",
    "environment": "development",
    "host.name": "localhost",
    "telemetry.sdk.name": "opentelemetry",
    "telemetry.sdk.language": "python",
})

# Setup Tracer Provider
tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

# Setup Logger Provider
logger_provider = LoggerProvider(resource=resource)
_logs.set_logger_provider(logger_provider)

# Setup Meter Provider
metric_readers = []
for endpoint in ["http://127.0.0.1:4318/v1/metrics", "http://localhost:4318/v1/metrics"]:
    try:
        reader = PeriodicExportingMetricReader(HTTPMetricExporter(endpoint=endpoint), export_interval_millis=1000)
        metric_readers.append(reader)
    except Exception as e:
        print(f"[SigNoz OTLP] HTTP Metric exporter notice for {endpoint}: {e}")

meter_provider = MeterProvider(resource=resource, metric_readers=metric_readers)
metrics.set_meter_provider(meter_provider)

# Register Trace Exporters (HTTP 4318 & gRPC 4317)
trace_endpoints_http = ["http://127.0.0.1:4318/v1/traces", "http://localhost:4318/v1/traces"]
trace_endpoints_grpc = ["http://127.0.0.1:4317", "http://localhost:4317"]

for ep in trace_endpoints_http:
    try:
        tracer_provider.add_span_processor(
            BatchSpanProcessor(HTTPTraceExporter(endpoint=ep), schedule_delay_millis=200)
        )
    except Exception as err:
        print(f"[SigNoz OTLP] HTTP Trace Exporter notice ({ep}): {err}")

for ep in trace_endpoints_grpc:
    try:
        tracer_provider.add_span_processor(
            BatchSpanProcessor(GRPCTraceExporter(endpoint=ep, insecure=True), schedule_delay_millis=200)
        )
    except Exception as err:
        print(f"[SigNoz OTLP] gRPC Trace Exporter notice ({ep}): {err}")

# Register Log Exporters (HTTP 4318 & gRPC 4317)
log_endpoints_http = ["http://127.0.0.1:4318/v1/logs", "http://localhost:4318/v1/logs"]
log_endpoints_grpc = ["http://127.0.0.1:4317", "http://localhost:4317"]

for ep in log_endpoints_http:
    try:
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(HTTPLogExporter(endpoint=ep), schedule_delay_millis=200)
        )
    except Exception as err:
        print(f"[SigNoz OTLP] HTTP Log Exporter notice ({ep}): {err}")

for ep in log_endpoints_grpc:
    try:
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(GRPCLogExporter(endpoint=ep, insecure=True), schedule_delay_millis=200)
        )
    except Exception as err:
        print(f"[SigNoz OTLP] gRPC Log Exporter notice ({ep}): {err}")

# Custom Logging Handler to format Severity Text properly for SigNoz (INFO, DEBUG, WARN, ERROR)
class SigNozLogHandler(LoggingHandler):
    def emit(self, record: logging.LogRecord):
        # Normalize WARNING -> WARN for SigNoz UI filters
        if record.levelname == "WARNING":
            record.levelname = "WARN"
        super().emit(record)

# Filter internal noisy logs
_INTERNAL_PREFIXES = (
    "opentelemetry",
    "urllib3",
    "requests",
    "httpx",
    "httpcore",
    "grpc",
)

class _NoInternalFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return not record.name.startswith(_INTERNAL_PREFIXES)

log_handler = SigNozLogHandler(level=logging.NOTSET, logger_provider=logger_provider)
log_handler.addFilter(_NoInternalFilter())

# Attach to application loggers
app_logger = logging.getLogger("ghosttrace")
app_logger.setLevel(logging.INFO)
if log_handler not in app_logger.handlers:
    app_logger.addHandler(log_handler)

root_logger = logging.getLogger()

root_logger.setLevel(logging.INFO)

if log_handler not in root_logger.handlers:
    root_logger.addHandler(log_handler)

# Flush on process exit
atexit.register(tracer_provider.force_flush)
atexit.register(logger_provider.force_flush)
atexit.register(meter_provider.force_flush)

# Global Tracer & Meter
tracer = trace.get_tracer("ghosttrace-ai")
meter = metrics.get_meter("ghosttrace-ai")

# Telemetry Metrics
request_counter = meter.create_counter(
    "ghosttrace_requests_total",
    description="Total number of GhostTrace AI investigation requests",
)
latency_histogram = meter.create_histogram(
    "ghosttrace_latency_seconds",
    description="Duration of AI investigation workflows in seconds",
)
token_counter = meter.create_counter(
    "ghosttrace_tokens_total",
    description="Total LLM tokens consumed",
)


def flush_telemetry():
    """Immediately flush all buffered spans, logs, and metrics to SigNoz."""
    try:
        tracer_provider.force_flush()
        logger_provider.force_flush()
        meter_provider.force_flush()
    except Exception as e:
        print(f"[SigNoz OTLP] Flush error: {e}")


def emit_telemetry_event(
    name: str,
    level: str = "INFO",
    message: str = "",
    attributes: Optional[Dict[str, Any]] = None,
):
    """Emit a paired OpenTelemetry span + log to SigNoz with explicit severity text."""
    attrs = attributes or {}
    attrs["service.name"] = "ghosttrace-ai"
    attrs["deployment.environment"] = "development"
    attrs["severity_text"] = level.upper()

    with tracer.start_as_current_span(name) as span:
        for k, v in attrs.items():
            span.set_attribute(k, v)

        log_level = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARN": logging.WARNING,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
        }.get(level.upper(), logging.INFO)

        app_logger.log(log_level, f"[{name}] {message}", extra=attrs)

    flush_telemetry()


# Background Live Telemetry Loop for SigNoz
_bg_task = None

async def _bg_telemetry_loop():
    """Continuously generates realistic telemetry every 3 seconds so SigNoz query never turns empty!"""
    print("[SigNoz Telemetry Engine] Started background telemetry generator loop.")
    severity_levels = ["INFO", "DEBUG", "WARN", "ERROR"]
    investigation_types = ["healthy", "slow_api", "vector_failure", "token_spike", "hallucination"]

    while True:
        try:
            level = random.choice(severity_levels)
            incident = random.choice(investigation_types)
            case_id = f"CASE-{random.randint(1000, 9999)}"
            tokens = random.randint(300, 2500)
            latency = round(random.uniform(0.12, 1.85), 3)

            # 1. Update Metrics
            request_counter.add(1, {"service.name": "ghosttrace-ai", "incident": incident, "severity": level})
            latency_histogram.record(latency, {"service.name": "ghosttrace-ai", "incident": incident})
            token_counter.add(tokens, {"service.name": "ghosttrace-ai", "model": "Gemini 2.5 Flash"})

            # 2. Emit Span & Log
            emit_telemetry_event(
                name=f"investigation-{incident}",
                level=level,
                message=f"Live AI Investigation {case_id} [{incident}] completed in {latency}s with {tokens} tokens",
                attributes={
                    "case_id": case_id,
                    "user.query": f"Analyze root cause for {incident}",
                    "incident": incident,
                    "llm.model": "Gemini 2.5 Flash",
                    "llm.total_tokens": tokens,
                    "tool.name": "Knowledge API",
                    "latency_s": latency,
                    "ghosttrace.status": "Active",
                },
            )

        except asyncio.CancelledError:
            print("[SigNoz Telemetry Engine] Background loop stopped.")
            break
        except Exception as err:
            print(f"[SigNoz Telemetry Engine] Warning in background loop: {err}")

        await asyncio.sleep(3.0)


def start_background_telemetry():
    """Start the background telemetry generator if not already running."""
    global _bg_task
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            if _bg_task is None or _bg_task.done():
                _bg_task = loop.create_task(_bg_telemetry_loop())
    except Exception as e:
        print(f"[SigNoz Telemetry Engine] Could not start background loop: {e}")
