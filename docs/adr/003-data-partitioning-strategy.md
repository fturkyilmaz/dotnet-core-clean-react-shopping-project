# 3. Data Partitioning Strategy

Date: 2025-12-01

## Status
Accepted

## Context
As the application grows, a single database instance may become a bottleneck. While we are currently using a monolithic PostgreSQL database, we need to identify how data will be partitioned (sharded) in the future to ensure horizontal scalability. This is particularly important for high-volume entities like `Products` and `Carts`.

## Decision
We have identified the following **Partition Keys** for our core entities, to be used when migrating to a sharded relational setup (e.g., Citus) or a NoSQL store (e.g., Cosmos DB, DynamoDB).

### 1. Products
-   **Partition Key**: `CategoryId`
-   **Justification**:
    -   Products are frequently queried by category.
    -   Partitioning by category ensures that queries for a specific category are routed to a single shard (Single-Partition Query), which is efficient.
    -   Cross-partition queries (e.g., "search all products") are less frequent than category browsing.

### 2. Carts / Orders
-   **Partition Key**: `UserId` (or `CustomerId`)
-   **Justification**:
    -   A user's cart and order history are almost always accessed in the context of that specific user.
    -   This guarantees that all data for a single user resides on the same shard, optimizing read/write performance for user-centric operations.

### Current Implementation (PostgreSQL)
-   We are currently using **PostgreSQL** in a non-partitioned setup.
-   We utilize **Indexes** on `CategoryId` and `UserId` to optimize query performance within the single instance.
-   **Why not NoSQL yet?**: The current scale and complexity of relationships (joins) favor a relational model. The overhead of managing a distributed NoSQL store is not yet justified.

## Consequences

### Positive
-   **Future-Proofing**: Identifying partition keys now prevents design choices that would make future sharding impossible (e.g., relying heavily on cross-category joins).
-   **Query Optimization**: Encourages developers to write queries that include the partition key (e.g., filtering by CategoryId), which improves performance even in the current relational setup.

### Negative
-   **Constraint**: Queries that do not include the partition key (e.g., "Get top 10 products by price across all categories") may become expensive "fan-out" queries in a future sharded architecture.
-   **Data Skew**: If one category (e.g., "Electronics") is significantly larger than others, it may create a "hot partition." This will need to be monitored.
