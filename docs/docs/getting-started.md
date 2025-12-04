Tabii Furkan 👨‍💻, işte sana doğrudan Markdown (.md) formatında “Getting Started” dokümanının tam hali:

---
sidebar_position: 2
---

# Getting Started

Welcome to ShoppingProject! This guide will help you set up the project locally and understand the basic workflow.

## Prerequisites

- **.NET 10 SDK** installed
- **Node.js 20+** and **npm** or **yarn**
- **PostgreSQL** (or your chosen database)
- **Redis** (for caching)
- **Docker** (optional, for containerized services)

## Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/fturkyilmaz/dotnet-core-clean-react-shopping-project.git
   cd dotnet-core-clean-react-shopping-project

Configure the database connection:

Update appsettings.Development.json with your PostgreSQL connection string:

"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=shoppingdb;Username=postgres;Password=yourpassword"
}

Apply migrations:

dotnet ef database update --project src/Infrastructure

Run the backend API:

dotnet run --project src/Presentation/API

The API will start on https://localhost:5001 (or the port defined in launchSettings.json).

Frontend Setup

Navigate to the frontend folder:

cd src/Presentation/ReactApp

Install dependencies:

npm install
# or
yarn install

Start the React development server:

npm run dev
# or
yarn dev

The frontend will run on http://localhost:5173 by default.

Running the Project

Backend: dotnet run --project src/Presentation/API

Frontend: npm run dev inside src/Presentation/ReactApp

Redis: Make sure Redis is running locally (redis-server) or via Docker.

PostgreSQL: Ensure your database is running and accessible.

Docker (optional): You can spin up PostgreSQL and Redis using Docker Compose:

docker-compose up -d

Workflow

Authentication: Users register/login via the API, JWT tokens are issued with claims.

Caching: Redis is used for response caching and rate limiting.

Background Jobs: Hangfire manages scheduled tasks (e.g., email sending).

Observability: OpenTelemetry + Prometheus + Grafana for metrics and tracing.

Frontend: React app communicates with the API, handles cart, orders, and notifications via SignalR hubs.

Next Steps

Explore the API docs at https://localhost:5001/swagger.

Check health endpoints: /health/live, /health/ready.

Try registering a new user and logging in to see JWT + claims in action.


---