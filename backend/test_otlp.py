import time
import logging
from opentelemetry import trace, metrics
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter as HTTPTraceExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter as GRPCTraceExporter
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter as HTTPLogExporter
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter as GRPCLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry._logs import set_logger_provider

def test():
    resource = Resource.create({
        "service.name": "ghosttrace-ai",
        "service.version": "1.0.0",
        "deployment.environment": "development",
        "environment": "development",
        "host.name": "localhost",
    })

    # Setup Tracing
    tracer_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(tracer_provider)
    
    # Try 127.0.0.1 and localhost for HTTP & gRPC
    for endpoint in ["http://127.0.0.1:4318/v1/traces", "http://localhost:4318/v1/traces"]:
        try:
            tracer_provider.add_span_processor(BatchSpanProcessor(HTTPTraceExporter(endpoint=endpoint), schedule_delay_millis=100))
            print(f"Added HTTP trace exporter for {endpoint}")
        except Exception as e:
            print(f"Failed HTTP trace exporter for {endpoint}: {e}")

    for endpoint in ["http://127.0.0.1:4317", "http://localhost:4317"]:
        try:
            tracer_provider.add_span_processor(BatchSpanProcessor(GRPCTraceExporter(endpoint=endpoint, insecure=True), schedule_delay_millis=100))
            print(f"Added gRPC trace exporter for {endpoint}")
        except Exception as e:
            print(f"Failed gRPC trace exporter for {endpoint}: {e}")

    # Setup Logging
    logger_provider = LoggerProvider(resource=resource)
    set_logger_provider(logger_provider)
    
    for endpoint in ["http://127.0.0.1:4318/v1/logs", "http://localhost:4318/v1/logs"]:
        try:
            logger_provider.add_log_record_processor(BatchLogRecordProcessor(HTTPLogExporter(endpoint=endpoint), schedule_delay_millis=100))
            print(f"Added HTTP log exporter for {endpoint}")
        except Exception as e:
            print(f"Failed HTTP log exporter for {endpoint}: {e}")

    for endpoint in ["http://127.0.0.1:4317", "http://localhost:4317"]:
        try:
            logger_provider.add_log_record_processor(BatchLogRecordProcessor(GRPCLogExporter(endpoint=endpoint, insecure=True), schedule_delay_millis=100))
            print(f"Added gRPC log exporter for {endpoint}")
        except Exception as e:
            print(f"Failed gRPC log exporter for {endpoint}: {e}")

    handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)
    logger = logging.getLogger("ghosttrace-test")
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    tracer = trace.get_tracer("ghosttrace-test")
    print("Emitting test spans and logs...")

    for i in range(5):
        with tracer.start_as_current_span(f"test-span-{i}") as span:
            span.set_attribute("test.iter", i)
            span.set_attribute("service.name", "ghosttrace-ai")
            logger.info(f"GhostTrace test log iteration {i} severity=INFO")
            logger.warning(f"GhostTrace test warning iteration {i} severity=WARN")
            logger.error(f"GhostTrace test error iteration {i} severity=ERROR")

    tracer_provider.force_flush()
    logger_provider.force_flush()
    print("Flushed traces and logs successfully!")

if __name__ == "__main__":
    test()
