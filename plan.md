# Headless CMS Architecture & Implementation Plan

## Architecture Overview

**Backend Stack (API)**
- **Framework:** NestJS
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Self-Hosted Supabase)
- **Role:** Handles all direct database connections, business logic, and security. Exposes REST/GraphQL endpoints for the frontend.

**Frontend Stack (Web Dashboard)**
- **Framework:** Next.js (App Router)
- **Data Fetching & Caching:** TanStack Query (React Query)
- **Data Grids:** TanStack Table
- **Forms & Validation:** React Hook Form + Zod
- **State Management:** Zustand
- **Role:** 
  - Uses Next.js Server Components for initial data fetching (hydration) and SEO.
  - Uses TanStack Query for highly interactive, cached, client-side data management.
  - Uses TanStack Table for complex CMS data grids (pagination, sorting, filtering).

---

## Implementation Phases

### Phase 1: Backend Foundation (NestJS + Drizzle)
- [ ] Install Drizzle ORM and Postgres drivers in `headless-cms-api`.
- [ ] Configure `drizzle.config.ts` to connect to the self-hosted Supabase instance.
- [ ] Set up the `DatabaseModule` in NestJS to inject the Drizzle connection.
- [ ] Define the initial database schema (e.g., `users`, `posts`, `categories`).
- [ ] Generate and push the first database migration.

### Phase 2: Core API Development
- [ ] Create generic CRUD repositories/services using Drizzle.
- [ ] Implement pagination, sorting, and filtering logic at the API level (to be consumed by TanStack Table).
- [ ] Build controllers for the initial entities.
- [ ] (Optional) Set up Supabase Auth verification in NestJS Guards.

### Phase 3: Frontend Foundation (Next.js + TanStack)
- [ ] Install frontend libraries: TanStack (Query/Table), Zustand, React Hook Form, and Zod in `headless-cms-web`.
- [ ] Set up the `QueryClientProvider` in the Next.js root layout.
- [ ] Create an API service layer (e.g., using `axios` or native `fetch`) to communicate with the NestJS backend.
- [ ] Build a generic, reusable TanStack Table component that supports server-side pagination and sorting.

### Phase 4: CMS Dashboard Integration
- [ ] Build the layout for the admin dashboard (Sidebar, Header).
- [ ] Implement the "Posts/Content" list view using the generic TanStack Table.
- [ ] Implement Server Component hydration: Fetch the first page of data on the server and pass it to TanStack Query for seamless initial load.
- [ ] Create mutation hooks (TanStack Query) for creating, updating, and deleting content.
- [ ] Integrate Tiptap Rich Text Editor for content creation, including image uploads to Cloudflare R2.

### Phase 5: Polish & Advanced Features
- [ ] Build a centralized Media Manager modal to handle browsing, choosing, and uploading images to Cloudflare R2.
- [ ] Refine loading states, error handling, and toast notifications.
- [ ] Finalize role-based access control (RBAC).

### Phase 6: Future Enhancements
- [ ] Integrate Resend (resend.com) for production-grade transactional emails (e.g., admin notifications for new blog comments).
