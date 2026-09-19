# Task Management System - Frontend

Task management application built with Next.js 16, React 19, and TypeScript with clean architecture.

## Features

- JWT-based authentication with secure session management
- Role-based access control (RBAC) + Attribute-based access control (ABAC)
- Task board with dependency-aware state management
- Real-time optimistic locking with conflict resolution
- Client data masking for multi-tenant isolation
- Immutable audit trail
- Responsive dark theme design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS 4
- **Data Fetching**: TanStack Query 5 + Axios
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Architecture**: Clean Architecture (Presentation, Application, Domain, Infrastructure, Shared)

## Setup

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://backend-production-27f5.up.railway.app
```

## Test Credentials

- **PM**: pm@nodewave.com / password123
- **Frontend**: frontend@nodewave.com / password123
- **Backend**: backend@nodewave.com / password123
- **UIUX**: uiux@nodewave.com / password123
- **Client**: client@example.com / password123

## Architecture

### Clean Architecture Layers

- **Presentation**: Pages, components, UI logic
- **Application**: Services, hooks, DTOs, business logic
- **Domain**: Entity definitions, types
- **Infrastructure**: API client, storage, external dependencies
- **Shared**: Global state (Zustand), utilities, constants

## Key Features

### Authentication
- JWT-based sessions with localStorage
- Protected route middleware
- Automatic token refresh on 401
- Role-based UI rendering

### Task Management
- 4-column Kanban board (TODO, IN_PROGRESS, DONE, BLOCKED)
- State-based permissions (can't start if dependencies incomplete)
- Optimistic locking with 409 conflict retry
- Real-time task updates

### RBAC + ABAC
- PM: Full access except cannot mark tasks DONE
- Engineers: Can only view assigned tasks
- Client Guest: Read-only, masked data

### Concurrency
- Version field on task updates
- Automatic conflict detection and retry
- Optimistic UI updates with rollback on error

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables on Vercel dashboard.
