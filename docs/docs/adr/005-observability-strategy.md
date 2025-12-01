# 5. Observability Strategy

Date: 2025-12-01

## Status
Accepted

## Context
In a distributed system (even a modular monolith), understanding "what is happening" is critical for diagnosing issues and monitoring performance. We need a unified strategy for logging, metrics, and tracing to avoid blind spots.

## Decision
We have adopted a comprehensive observability stack based on **OpenTelemetry** and **Serilog**.

### 1. Structured Logging
-   **Tool**: **Serilog**.
-   **Format**: JSON (Structured).
-   **Sinks**:
    -   **Console**: For local development.
    -   **Elasticsearch**: For centralized log aggregation (ELK Stack).
-   **Enrichment**: Logs are enriched with `TraceId`, `SpanId`, and `Environment` to correlate them with traces.

### 2. Metrics
-   **Tool**: **OpenTelemetry**.
-   **Exposition**: Prometheus format.
-   **Key Metrics**:
    -   HTTP Request Duration/Count.
    -   Runtime Metrics (GC, Memory, CPU).
    -   Custom Business Metrics (e.g., "Orders Placed").

### 3. Distributed Tracing
-   **Tool**: **OpenTelemetry**.
-   **Exporter**: OTLP (OpenTelemetry Protocol) to a collector or backend (e.g., Jaeger, Zipkin, or Elastic APM).
-   **Scope**: Traces propagate across HTTP calls, Database queries (EF Core), and Message Bus (MassTransit) operations.

### 4. Health Checks
-   **Tool**: ASP.NET Core Health Checks.
-   **Checks**: Database (PostgreSQL), Cache (Redis), Message Broker (RabbitMQ).
-   **UI**: `HealthChecks.UI` provides a visual dashboard.

## Consequences

### Positive
-   **Visibility**: Full visibility into the request lifecycle across all components.
-   **Correlation**: Ability to jump from a metric spike to a trace, and from a trace to specific logs via `TraceId`.
-   **Proactive Monitoring**: Health checks and metrics allow us to detect issues before users report them.

### Negative
-   **Overhead**: Collecting and storing telemetry data consumes resources (CPU, Network, Storage).
-   **Configuration**: Setting up the full stack (ELK, Prometheus, Jaeger) requires significant DevOps effort.
-   **Noise**: Without careful tuning, logs and traces can become overwhelming and expensive to store.
