# Technical Design Document: Yumami MVP

## Overview

**Project:** Yumami  
**Goal:** Build a web-first, mobile-oriented shared life app for two users that centralizes tasks, calendar visibility, financial PDF processing, and shared file access.  
**Planned evolution:** Start with web, then extend to mobile once the core product and data model are stable.

## Recommended Technical Approach

### Primary Recommendation: Full-Stack TypeScript with React, Supabase, and a Python Worker for PDF Processing

This is the best-fit approach for your situation because it balances learning value, delivery speed, free-tier friendliness, and future extensibility.

**Recommended stack:**
- **Frontend:** Next.js + TypeScript
- **UI:** React + Tailwind CSS + shadcn/ui
- **Backend:** Next.js server actions / route handlers
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime for shared task/dashboard refreshes
- **File storage:** Supabase Storage for app-owned uploads, external links for Google Drive in MVP
- **PDF processing:** Python service or background job for parsing bank PDFs
- **Hosting:** Vercel for web app, Supabase for database/backend services
- **Mobile later:** React Native with Expo reusing TypeScript domain knowledge and API layer

### Why This Fits You
- You already understand SQL, so Postgres and relational modeling are a natural fit.
- Next.js gives you a clean full-stack path without needing to manage separate frontend and backend repos immediately.
- Supabase removes a lot of auth and backend boilerplate while keeping a real SQL database.
- Python remains useful for the one area where it gives you a real advantage: document parsing and categorization logic.
- This setup keeps the MVP small enough to ship while leaving room for mobile and AI later.

## Alternatives Compared

| Option | Pros | Cons | Cost | Recommendation |
|--------|------|------|------|----------------|
| Next.js + Supabase + Python worker | Fast MVP, good learning path, SQL-friendly, mobile extension later, good free tiers | Some platform coupling, self-hosting later is extra work | Free/low | Best overall |
| Django + HTMX/React + Postgres | Python-friendly, strong backend structure, self-hosting friendly | Slower modern frontend/mobile path, more setup for polished UX | Low | Good backend-heavy alternative |
| React + FastAPI + Postgres | Clear separation, Python backend, strong API architecture | More moving parts, more setup, slower for solo MVP | Low | Good if backend-first becomes priority |
| Firebase + React | Fast setup, realtime built in | NoSQL is a worse fit for your SQL strengths, vendor lock-in, weaker relational modeling | Free/low | Not recommended |

## Recommendation Summary

### Choose: Next.js + Supabase + Python Worker

**Why this is the best option:**
- Best balance of learning and shipping
- Lets you use SQL strongly from day one
- Keeps the app web-first and mobile-ready
- Handles CRUD, auth, and near-real-time updates cleanly
- Gives Python a focused role where it is genuinely useful

**Trade-offs:**
- You will need to learn TypeScript and React patterns more seriously
- You may outgrow Vercel/Supabase free tiers later
- Private self-hosting is possible later, but not the easiest day-one path

## Platform Strategy

### MVP Platform
Build **web first** with a mobile-first responsive interface.

### Why Web First
- Faster to ship than native mobile
- Easier to debug and iterate
- One codebase for the first real version
- Good enough for your two-user beta
- Lets you validate the product before adding mobile packaging

### Mobile Later Strategy
Once the core product is stable:
1. Keep backend and database unchanged
2. Reuse the data model and business rules
3. Build React Native / Expo client for mobile
4. Share types and validation rules where possible

## Architecture Style

### Recommended Pattern: Modular Monolith

For this MVP, use a modular monolith rather than microservices.

**Definition:**
- One main application codebase
- Clear modules for tasks, calendar, finances, files, auth
- Background processing only where needed (PDF parsing)

**Why:**
- Easier to reason about
- Easier for a solo builder with AI support
- Less deployment complexity
- Still structured enough to grow later

## High-Level System Design

```text
[Browser / Mobile Browser]
        |
        v
[Next.js App]
  - UI routes
  - Server actions / API routes
  - Auth-aware data access
        |
        +-------------------+
        |                   |
        v                   v
[Supabase Postgres]   [Supabase Storage]
        |
        v
[Realtime updates]

[Python PDF Processing Module]
  - parse uploaded bank PDFs
  - extract transactions
  - suggest categories
  - return uncertain rows for review
```

## Core Technical Decisions

### 1. Frontend

**Primary choice:** Next.js + React + TypeScript

**Why:**
- Great ecosystem
- Strong AI tooling support
- Easy deployment
- Supports full-stack workflows
- Good path to clean app architecture

**Alternatives:**
- Remix: excellent, but smaller ecosystem for your use case
- SvelteKit: pleasant, but weaker fit if you later go React Native
- Vue/Nuxt: valid, but less aligned with the mobile follow-up path

### 2. Backend

**Primary choice:** Next.js backend features first, Python service second

**How responsibilities split:**
- Use Next.js route handlers/server actions for app CRUD, auth-aware access, dashboard assembly, and integrations
- Use Python only for specialized document parsing and categorization workflows

**Why:**
- Keeps main architecture simple
- Avoids overbuilding a separate backend too early
- Still uses your strongest language for complex text/document logic

### 3. Database

**Primary choice:** PostgreSQL via Supabase

**Why:**
- Strong fit for relational shared-life data
- Great for tasks, users, transactions, categories, documents, calendar references
- Easy auth integration
- Realtime support available

**Core data model direction:**
- `users`
- `households`
- `household_members`
- `tasks`
- `task_comments` (later)
- `calendar_sources`
- `calendar_events_cached` (if syncing data)
- `documents`
- `transactions`
- `transaction_categories`
- `transaction_review_queue`
- `file_links`

### 4. Authentication

**Primary choice:** Supabase Auth with email magic link or email/password

**Why:**
- Fastest secure setup for two users
- Avoids custom auth mistakes
- Easy row-level security integration

**Recommendation:**
Start with email-based login and keep membership restricted to one household for MVP.

### 5. Realtime Updates

**Primary choice:** Supabase Realtime only for tasks/dashboard freshness

**Why:**
- You said real-time matters, but not instantaneously
- Realtime for shared tasks is useful
- Do not overuse realtime everywhere in MVP

**Guideline:**
Use realtime only where collaborative feel matters. Polling or refresh is acceptable for slower-changing modules like files and finance summaries.

## Feature-by-Feature Technical Design

### Feature 1: Shared To-Do List

**Complexity:** Low to Medium

**Implementation:**
- Tasks stored in Postgres
- Shared by household ID
- Realtime subscription for create/update/complete actions
- UI views for all, today, overdue, completed

**Key fields:**
- title
- description
- due_date
- status
- assigned_to_user_id
- created_by_user_id
- household_id
- category

### Feature 2: Dashboard Overview

**Complexity:** Medium

**Implementation:**
- Dashboard queries summarized server-side
- Tile components for tasks, calendar, finance status, files
- Prioritization logic based on due dates, unread review items, and upcoming events

**Important decision:**
Do not make the dashboard a giant live data engine initially. Use lightweight summary queries and refresh intelligently.

### Feature 3: Calendar Visibility

**Complexity:** Medium to High

**MVP recommendation:** Linked/integrated visibility, not full calendar ownership.

**Options:**
1. Link out only to iCloud calendar
2. Import/sync calendar data into app
3. Use calendar subscription/feed if available

**Recommended MVP path:**
Start with a lightweight integration approach rather than trying to fully own calendar creation/editing.

**Why:**
- Calendar APIs, especially Apple-related flows, can add complexity quickly
- The MVP needs visibility first, not full calendar replacement

### Feature 4: Financial PDF Import and Categorization

**Complexity:** High

**Implementation plan:**
- User uploads PDF
- Store source file in Supabase Storage
- Trigger Python parser
- Extract transaction rows
- Run category suggestion rules
- Create review items for low-confidence matches
- Save approved transactions in Postgres

**Categorization strategy v1:**
- Rule-based supplier mapping first
- Manual correction UI
- Save corrections as future mapping hints

**Why not AI first:**
- Deterministic parsing and rule-based categorization are easier to trust and debug
- Later AI can improve edge cases and supplier understanding

### Feature 5: Shared Files Access Hub

**Complexity:** Medium

**MVP recommendation:** Use a central file hub with links/metadata before deep third-party file synchronization.

**Implementation options:**
1. Simple curated link hub to shared folders/files
2. Embedded shared storage views where feasible
3. Full Drive API integration later

**Recommended MVP path:**
Start with shared file links and app-owned uploads for important docs.

**Why:**
- Delivers centralization quickly
- Avoids complex OAuth/API work immediately
- Keeps the app useful while preserving future expansion

## AI Features Strategy

AI features are intentionally **not part of the MVP**, but the architecture should prepare for them.

### Planned v1.5 AI Capabilities
- Document understanding improvements for ambiguous financial rows
- Summaries of recent tasks, upcoming events, or monthly spending
- Recommendations for reminders, planning, and periodic actions
- Smart reminders based on repeated behavior patterns

### AI Architecture Direction
- Keep structured app data clean and queryable first
- Add an AI service later that reads approved application data
- Separate prompts, recommendation logic, and audit logging from core CRUD logic

### Privacy Position
Since your privacy preference is undecided, design the system so AI can later be:
- cloud API powered, or
- self-hosted/private

This means keeping AI as an isolated layer, not tightly embedded into the main transaction flow.

## Hosting and Deployment

### MVP Hosting Recommendation
- **Web app:** Vercel free tier
- **Database/Auth/Storage:** Supabase free tier
- **PDF worker:** local during development, then lightweight self-hosted process or scheduled worker if needed

### Alternative Hosting Path
If you want more control later:
- Host Next.js and Python on a VPS such as Hostinger
- Run Postgres and storage stack separately or self-host Supabase alternatives

### Recommendation
Start with managed hosting for speed. Move to private hosting once product shape is stable.

**Why:**
- Faster iteration
- Fewer infra distractions
- Better fit for 1-2 month MVP timeline

## Security and Privacy Design

### Principles
- Household-based access control
- Row-level restrictions in database
- Private documents stored with authenticated access only
- Minimal personal data collection
- Audit important document-processing actions

### Minimum MVP Security Requirements
- Secure authentication
- Protected file access
- HTTPS everywhere
- Server-side authorization checks
- No secrets exposed in frontend code

## Performance Design

### MVP Performance Targets
- Dashboard initial load under 2 seconds in normal use
- Task updates reflected within a few seconds
- PDF processing should provide immediate status feedback and background completion

### Performance Strategy
- Server-render or prefetch dashboard summaries where useful
- Paginate heavier tables like transactions
- Cache non-sensitive derived summaries when helpful
- Use async processing for document extraction

## Development Workflow Recommendation

### Build Strategy
Use **learn-by-doing with AI guidance**.

### Recommended workflow
1. Build one module at a time
2. Before each module, review the plan together
3. After implementation, pause for explanation
4. Answer a few checkpoint questions before continuing
5. Record key lessons in project notes or `MEMORY.md`

### Good build order
1. Auth + household model
2. Shared tasks
3. Dashboard shell
4. Shared file hub
5. Financial PDF upload pipeline
6. Calendar visibility
7. Dashboard prioritization improvements
8. AI layer later

## Testing Strategy

### Recommended test mix
- **Unit tests:** data transformations, categorization helpers, validation
- **Integration tests:** auth, task flows, upload pipeline, dashboard queries
- **E2E tests:** core two-user flows for tasks and dashboard

### Tools
- Vitest for unit/integration tests
- Playwright for E2E
- Pytest for Python PDF parsing module if split into its own service/module

## Project Structure Recommendation

```text
src/
  app/
  components/
  features/
    tasks/
    dashboard/
    calendar/
    finances/
    files/
    auth/
  lib/
    db/
    auth/
    realtime/
    integrations/
    utils/
  types/

python/
  pdf_parser/
  tests/

supabase/
  migrations/
  policies/
```

## Learning Checkpoint Style

Because you want to understand the build, each major phase should include:
- what was built
- why this approach was chosen
- what alternatives existed
- 2-4 short questions you should be able to answer before moving on

Example checkpoint:
- Why did we choose relational tables for tasks and transactions?
- What belongs in a server action versus the client?
- Why is PDF parsing handled asynchronously?
- Why did we delay AI for this workflow?

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope grows too fast | Delays MVP | Keep AI and deep integrations out of MVP |
| PDF parsing is harder than expected | Finance feature slips | Start with one known bank format only |
| Calendar integration becomes messy | Delivery slowdown | Use visibility/link-first strategy |
| Hosting/privacy concerns expand scope | Infra distraction | Start managed, revisit self-hosting after MVP |
| Too many technologies at once | Learning overload | Keep Python limited to PDF workflow and core app in one stack |

## Technical Roadmap

### MVP Phase
- Web app only
- Auth and household membership
- Shared tasks
- Dashboard
- Shared file links/uploads
- Bank PDF import for one known format
- Basic calendar visibility

### V1 Phase
- Better dashboard prioritization
- Better transaction review flows
- Cleaner file/document organization
- More robust calendar synchronization

### V1.5 Phase
- AI summarization
- AI recommendations
- Smart reminders
- Better document understanding

## Final Recommendation

Build Yumami as a **web-first modular monolith using Next.js, TypeScript, Supabase, and a focused Python PDF processing module**.

This is the strongest balance between:
- your SQL/Python strengths
- your desire to learn properly
- your low budget
- your 1-2 month MVP goal
- your plan to expand to mobile and AI later

It keeps the architecture modern and practical without making the early build heavier than it needs to be.
