---
sidebar_position: 2
---

# Getting Started

## Prerequisites

- .NET 9-10 SDK
- Docker Desktop
- PostgreSQL
- Redis

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/furkanturkyilmaz/ShoppingProject.git
   ```

2. Start Infrastructure:
   ```bash
   docker-compose up -d
   ```

3. Run the API:
   ```bash
   dotnet run --project src/API/ShoppingProject.WebApi.csproj
   ```

4. Run the Gateway:
   ```bash
   dotnet run --project src/Gateway/ShoppingProject.Gateway.csproj
   ```
