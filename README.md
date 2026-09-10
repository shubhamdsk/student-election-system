# Student Election System

A full-stack application for managing student elections. Students can register, apply as candidates, vote, view published results, and receive notifications. Administrators review students and candidates and manage the election lifecycle.

## Features

- Student registration, approval, and JWT-based authentication
- Role-protected student and administrator areas
- Election creation and lifecycle management
- Candidate applications and administrative review
- One-vote-per-election participation tracking
- Published election results
- In-app notifications
- Swagger/OpenAPI documentation in development

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, TanStack Query, AG Grid, Sass |
| Backend | ASP.NET Core 10, Entity Framework Core 10, JWT authentication |
| Database | Microsoft SQL Server |

## Repository structure

```text
.
|-- backend/
|   |-- src/
|   |   |-- StudentElectionSystem.Api/            # HTTP API and application startup
|   |   |-- StudentElectionSystem.Application/    # Use cases, DTOs, and interfaces
|   |   |-- StudentElectionSystem.Domain/         # Entities and domain enums
|   |   `-- StudentElectionSystem.Infrastructure/ # EF Core, repositories, and authentication
|   `-- StudentElectionSystem.slnx
|-- frontend/
|   `-- student-election-web/                      # React application
|-- docs/
`-- migration.sql                                  # Generated SQL migration script
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) and npm
- Microsoft SQL Server (the development configuration uses SQL Server Express)
- EF Core CLI (`dotnet tool install --global dotnet-ef`) if applying migrations from the command line

## Local setup

### 1. Configure the database and secrets

The checked-in development settings target this SQL Server instance and database:

```text
Server=localhost\SQLEXPRESS01;Database=StudentElectionSystemDb
```

If that does not match your environment, override the connection string and development-only secrets with environment variables before starting the API. In PowerShell:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=YOUR_SERVER;Database=StudentElectionSystemDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
$env:Jwt__Key = "replace-with-a-long-development-secret"
$env:AdminBootstrap__Email = "admin@example.com"
$env:AdminBootstrap__Password = "replace-with-a-development-password"
```

The checked-in `appsettings.Development.json` contains local-only defaults. Environment variables take precedence over those settings.

### 2. Apply the database migrations

From the repository root:

```sh
dotnet ef database update --project backend/src/StudentElectionSystem.Infrastructure --startup-project backend/src/StudentElectionSystem.Api
```

### 3. Start the API

```sh
dotnet run --project backend/src/StudentElectionSystem.Api --launch-profile http
```

The API runs at `http://localhost:5241`. In Development, Swagger UI is available at `http://localhost:5241/swagger` and the configured administrator account is created if it does not already exist.

### 4. Start the frontend

In a second terminal:

```sh
cd frontend/student-election-web
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Requests to `/api` are proxied to the local API.

To use a different API path or proxy target, copy `.env.example` to `.env.local` and update:

```dotenv
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5241
```

## Development commands

### Backend

Run these commands from the repository root:

```sh
# Restore and build the solution
dotnet restore backend/StudentElectionSystem.slnx
dotnet build backend/StudentElectionSystem.slnx

# Run the API
dotnet run --project backend/src/StudentElectionSystem.Api --launch-profile http
```

### Frontend

Run these commands from `frontend/student-election-web`:

```sh
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Application flow

1. A student registers and waits for administrator approval.
2. An administrator approves or rejects the student account.
3. The administrator creates an election and opens nominations.
4. Approved students apply as candidates; the administrator reviews the applications.
5. The administrator starts voting, approved students cast their votes, and voting is closed.
6. The administrator publishes the results for students to view.

## Security notes

- Values in `appsettings.Development.json` are for local development only. Replace the JWT key and bootstrap administrator credentials outside local development.
- Do not commit local settings, access tokens, passwords, or production connection strings.
- Serve production deployments over HTTPS and supply configuration through a secure secrets provider.
