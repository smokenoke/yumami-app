# Product Requirements Document: Yumami MVP

## Product Overview

**App Name:** Yumami  
**Tagline:** A shared life hub for couples to manage schedules, tasks, finances, and admin in one place  
**Launch Goal:** Learn to build apps while shipping a genuinely useful personal product that makes daily coordination easier for the two of us  
**Target Launch:** 1-2 months for MVP

## Who It's For

### Primary User
Young couples with careers who share schedules, finances, household responsibilities, and admin tasks.

**Current Pain Points:**
- Shared information is spread across too many apps and files
- Important tasks and obligations are easy to miss
- Monthly financial admin takes manual effort
- There is no single dashboard showing what matters right now

**Current Tools They Use:**
- iCloud Calendar for scheduling
- Google Drive for shared files and spreadsheets
- Excel sheets for monthly financial tracking
- Shared bank account and PDF transaction statements

**What They Need:**
- A single overview of shared life admin
- A lightweight way to manage shared to-dos
- A simple flow to process financial documents consistently
- Clear visibility into what is urgent, upcoming, or incomplete

## Problem Statement

Yumami solves the problem of shared life coordination for a couple whose schedules, finances, planning, and household admin are currently scattered across multiple tools. Instead of checking separate calendars, spreadsheets, bank PDFs, and task lists, users should be able to open one app and quickly understand what needs attention.

The MVP should focus on giving the two users a practical, centralized control panel rather than trying to replace every tool at once. Some systems may remain integrations or linked destinations in early versions.

## Product Vision

Create a calm, mobile-first shared life app that feels like a personal operating system for two people: simple, clear, warm, and useful in everyday life.

## Target User and Needs

| Area | Details |
|------|---------|
| Primary user type | Young couple with shared responsibilities |
| Lifestyle | Career-focused, busy, coordinating shared schedules and finances |
| Main problem | Too many disconnected apps and files for shared life management |
| Current solution | iCloud Calendar, Google Drive, Excel sheets, bank PDFs |
| Desired outcome | One overview with actionable information and easier recurring admin |

## Main User Flow

1. User opens Yumami because they want a quick overview of shared life admin.
2. They land on a dashboard showing urgent and upcoming items in tiles.
3. They review shared to-dos, upcoming calendar items, and financial/admin status.
4. They open a focused screen such as tasks, calendar, timeline, or finances.
5. They complete a real-world or digital action with clarity and less friction.

## Core MVP Features

### 1. Shared To-Do List
**What it does:**  
Lets the two users create, assign, update, and complete shared tasks in one place.

**Why it's essential:**  
This is the simplest core shared workflow and creates daily value immediately.

**MVP expectations:**
- Shared task list for both users
- Create, edit, complete, and delete tasks
- Optional due date and category
- Visibility into overdue and upcoming tasks

### 2. Dashboard Overview
**What it does:**  
Shows the most urgent and relevant shared information in a tile-based home screen.

**Why it's essential:**  
The dashboard is the app's main promise: one clear place to understand what matters now.

**MVP expectations:**
- Home dashboard with tile layout
- Upcoming items summary
- Shared task summary
- Quick navigation to core sections
- Space reserved for future recommendation widgets

### 3. Calendar Visibility
**What it does:**  
Provides a shared view of relevant schedule information for the couple.

**Why it's essential:**  
Scheduling is one of the main problems the app is meant to solve.

**MVP expectations:**
- Shared calendar overview
- Upcoming event list and/or calendar timeline
- Ability to view relevant schedule data in-app
- Early versions may integrate or link to existing calendar systems rather than fully replace them

### 4. Financial PDF Import and Categorization
**What it does:**  
Allows users to upload a monthly bank PDF and extract transactions into structured categories.

**Why it's essential:**  
This removes a repetitive manual task and creates meaningful admin value early.

**MVP expectations:**
- Upload bank PDF in a known recurring format
- Parse transactions from the document
- Suggest category based on supplier/payee
- Ask user for clarification when confidence is low
- Save categorized results for monthly tracking

### 5. Shared Files Access Hub
**What it does:**  
Provides centralized access to shared files and documents currently stored in external systems such as Google Drive.

**Why it's essential:**  
File access is part of the centralization goal and helps reduce tool switching.

**MVP expectations:**
- Central entry point to shared files
- At minimum, linked or embedded access to shared storage
- Full file management can come later if direct integration is complex

## Out of Scope for MVP

These features are intentionally deferred to keep version 1 realistic:
- AI recommendation engine
- Advanced smart suggestions based on habits or recurring events
- Inviting more than the two primary users
- Full replacement of every existing external tool
- Complex budgeting analytics or forecasting
- Enterprise-grade collaboration features

## V1.5 Features

### AI Recommender
The AI layer will be built on top of the MVP once the core shared data flows are stable.

**Planned purpose:**
- Suggest actions based on schedules, tasks, and financial patterns
- Identify recurring or periodic events
- Surface timely reminders or planning suggestions

**Why deferred:**
- The MVP should first prove value through reliable shared organization
- AI depends on clean source data and enough app context to be useful
- Shipping without AI improves delivery odds within 1-2 months

## Success Metrics

### Short Term (First Month)
- Users add shared tasks regularly
- Users complete tasks inside the app
- Users successfully import and review financial PDFs
- Users return to the dashboard as a daily or weekly overview tool

### Medium Term (Three Months)
- The app becomes part of the couple's recurring planning/admin workflow
- More core modules are added without increasing complexity too much
- The product structure supports adding AI recommendations later

## UX and Design Requirements

### Visual Direction
- Simple
- Rounded
- iOS-like
- Calm and clean
- Mobile-first

### Key Screens
- Dashboard
- Shared to-do view
- Calendar/timeline view
- Financial dashboard
- File access hub

### UX Principles
- Fast overview first
- Urgent items should be obvious
- Avoid clutter and over-complication
- Reduce app switching
- Keep important actions reachable within 1-2 taps

## Non-Functional Requirements

### Performance
- App should feel fast on mobile devices
- Dashboard should load quickly with summarized data
- Document import should be responsive and clearly indicate processing state

### Security and Privacy
- Private personal data must be handled carefully
- Prefer architectures that can live on a private server where practical
- Keep authentication and access control simple but secure
- Financial and schedule data should not be exposed to other users

### Scalability
- MVP is for two users only
- Architecture should not block future support for additional invited users
- Scaling considerations should not add unnecessary MVP complexity

### Reliability
- Core workflows should be stable and predictable
- PDF import should gracefully handle parse failures or ambiguous categories
- Calendar and file connections should fail safely with clear fallback behavior

## Constraints

| Constraint | Requirement |
|-----------|-------------|
| Budget | Keep it as free as possible |
| Timeline | 1-2 months for usable MVP |
| Platforms | Mobile-first with web companion |
| Users | Two primary users in MVP |
| Tech preference | Best-fit technology, not necessarily familiar-only tools |
| Hosting preference | Prefer private/self-hosted direction where practical |

## Product Scope Summary

### Must Have
- Shared to-do list
- Dashboard overview
- Calendar visibility
- Financial PDF import and categorization
- Shared file access hub

### Should Have
- Better categorization review flow for uncertain financial entries
- Timeline-based organization for upcoming items
- Useful dashboard prioritization logic

### Could Have
- More detailed financial insights
- Richer integrations with third-party tools
- Notification preferences

### Won't Have in MVP
- AI recommender
- Multi-household or broad invite system
- Full replacement of all third-party tools
- Advanced analytics and forecasting

## Risks and Open Questions

### Product Risks
- Scope creep across scheduling, files, finance, and AI
- Trying to replace too many tools too early
- Building integrations that are too complex for MVP timeline

### Technical Risks
- Reliable PDF parsing may vary by bank format
- Calendar and file integrations may introduce auth complexity
- Self-hosting preferences may complicate early delivery

### Open Questions for Tech Design
- Should calendar and file systems be linked, embedded, or fully synced in MVP?
- Should the stack prioritize easiest cross-platform development or strongest long-term architecture?
- How much financial history should be stored locally in v1?
- What is the simplest secure auth model for just two users?

## MVP Definition of Done

The MVP is successful when:
- Both users can log in and access the app
- Both users can create and manage shared to-dos
- Both users can see shared schedule information in one place
- Monthly bank PDFs can be uploaded and categorized with reasonable accuracy
- Shared files are accessible through the app hub
- The dashboard gives a useful, low-friction overview of what needs attention

## Future Vision

After the MVP is stable, Yumami can evolve into a richer shared life operating system with AI-powered recommendations, smarter recurring planning support, more financial automation, and broader multi-user collaboration.
