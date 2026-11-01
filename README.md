# VertexSpace

Web client for a role-based workspace management system: buildings, floors, desks, rooms, bookings and waitlists.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

## About

VertexSpace is the frontend of an office space management platform. It talks to a separate REST API (by default at `http://localhost:8080`) and gives each role its own dashboard: **System Admins** manage the physical workspace and all bookings, while **Department Admins** and **Users** get their own dashboards (currently early-stage). This repository contains the frontend only.

## Features

- **Authentication** with login, logout and a `/api/auth/me` session check; the access token is read from an `access_token` cookie and sent as a Bearer header
- **Role-based routing** (`USER`, `DEPARTMENT_ADMIN`, `SYSTEM_ADMIN`) with protected routes and a home redirect to the right dashboard
- **System Admin console**
  - Overview dashboard with stat cards and quick actions
  - Register new users
  - Manage buildings, floors and departments (create, update, soft and hard delete)
  - Manage resources (rooms, desks, parking), including room booking type (exclusive/shared) and desk mode (assigned/hot desk)
  - Desk assignments by department, user or desk
  - View all bookings and waitlists
  - Placeholder pages for reports, job history, batch jobs and settings
- **Typed API layer**: every backend route is documented in `src/constants/ApiRoutes.ts`, with React Query hooks per domain in `src/hooks/`
- Lazy-loaded pages, toast notifications (sonner) and a shadcn/ui-style component library

## Tech Stack

- React 19 + TypeScript, built with Vite 7
- React Router 7
- TanStack React Query 5 + Axios
- Tailwind CSS 4, Radix UI primitives, Material UI, lucide-react icons
- ESLint (typescript-eslint)

## Project Structure

```
src/
  App.tsx                  # Routes and role guards
  constants/ApiRoutes.ts   # All backend endpoints
  services/HttpClient.tsx  # Axios instance + auth interceptor
  hooks/
    useAuth.tsx            # Auth context
    admin/                 # Booking, Building, Department, DeskAssignment, Floor, Resource, Waitlist hooks
    user/ shared/
  pages/                   # Login, Register, role dashboards
  features/systemAdmin/pages/  # System admin screens
  components/
    layout/                # DashboardLayout, Sidebar
    ui/                    # Reusable UI components
```

## Getting Started

**Prerequisites:** Node.js 20+ and a running VertexSpace backend API.

```bash
npm install
npm run dev        # start the Vite dev server
npm run build      # type-check and build
npm run preview    # preview the production build
npm run lint
```

### Environment Variables

| Name | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL. Defaults to `http://localhost:8080` |

## Backend API Used

| Area | Base path |
| --- | --- |
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout` |
| Users | `/api/users` |
| Departments | `/api/departments` |
| Buildings | `/api/buildings` |
| Floors | `/api/floors` |
| Resources | `/api/resources` |
| Desk assignments | `/api/desk-assignments` |
| Waitlist | `/api/waitlist` |
| Bookings | `/api/bookings` (including `/best-slots`) |

See `src/constants/ApiRoutes.ts` for the full list with HTTP methods.

## Author

**Aryan Bhandari**: [GitHub](https://github.com/aryanbha123)
