# 4. Event-Driven Architecture

Date: 2025-12-01

## Status
Accepted

## Context
The application needs to handle operations that don't require an immediate response to the user or that affect multiple independent subsystems (e.g., updating inventory when an order is placed, sending notifications). Tightly coupling these services via direct HTTP calls would reduce availability and increase latency. We need an asynchronous messaging mechanism.

## Decision
We have decided to implement an **Event-Driven Architecture** using **MassTransit** as the message bus abstraction and **RabbitMQ** as the message broker.

-   **Message Bus**: MassTransit provides a consistent abstraction over the message broker, handling retries, serialization, and routing.
-   **Broker**: RabbitMQ is used for reliable message queuing and delivery.
-   **Pattern**: Publish/Subscribe.
    -   **Events**: Immutable facts that happened in the past (e.g., `CartCreatedEvent`, `ProductAddedEvent`).
    -   **Consumers**: Services subscribe to events they are interested in.

## Consequences

### Positive
-   **Decoupling**: Services (e.g., Cart Service, Notification Service) are decoupled. The publisher doesn't know who consumes the event.
-   **Resilience**: If a consumer is down, messages are queued in RabbitMQ until the service recovers.
-   **Scalability**: We can scale consumers independently based on queue depth.
-   **Extensibility**: New features (e.g., Analytics) can be added by simply subscribing to existing events without modifying the publisher.

### Negative
-   **Complexity**: Introduces a new infrastructure component (RabbitMQ) to manage.
-   **Eventual Consistency**: The system is no longer strongly consistent. The UI must handle states where updates haven't propagated yet.
-   **Debugging**: Tracing a request across multiple services via asynchronous messages is harder than tracing a synchronous call chain.
