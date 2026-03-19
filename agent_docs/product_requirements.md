# Product Requirements

## Product Summary
**Product:** Yumami  
**One-line description:** A shared life-management app for two people to coordinate schedules, tasks, finances, and admin in one place.

## Target Users
Young couples with careers who share schedules, finances, household responsibilities, and recurring admin tasks.

## Problem Statement
Shared life information is scattered across too many separate tools such as calendars, Google Drive files, spreadsheets, and bank PDFs. Yumami should reduce that fragmentation by providing one clear dashboard and a few focused workflows.

## Primary User Story
As one half of a busy couple, I want one app that gives me a quick, shared overview of our tasks, schedule, financial admin, and important files so that I can coordinate our daily life with less friction.

## Core MVP Features

### 1. Shared To-Do List
- Shared task list for both users
- Create, edit, complete, and delete tasks
- Optional due date and category
- Visibility into overdue and upcoming tasks
- Essential because it provides immediate shared value every day

### 2. Dashboard Overview
- Tile-based home dashboard
- Shows urgent and upcoming information first
- Summaries for tasks, calendar items, financial review status, and shared files
- Quick navigation to focused sections
- Must feel clear, lightweight, and mobile-friendly

### 3. Calendar Visibility
- Shared view of relevant schedule information
- Upcoming events list and/or timeline view
- MVP can link or lightly integrate with existing calendar systems rather than replace them
- Goal is visibility first, not full calendar ownership

### 4. Financial PDF Import and Categorization
- Upload monthly bank PDF statements
- Parse transactions from one known recurring bank format
- Suggest category based on supplier or payee
- Request manual clarification when confidence is low
- Save categorized transaction data for monthly tracking and later automation

### 5. Shared Files Access Hub
- Central access point for important shared files and folders
- May begin as curated links or lightweight integration with Google Drive
- Full third-party file management is not required for MVP

## Should-Have Features
- Better review flow for uncertain transaction categorization
- Timeline-oriented organization for upcoming items
- Smarter dashboard prioritization logic

## Could-Have Features
- More detailed financial insight views
- Richer third-party integrations
- Notification preferences

## Explicitly Out of Scope for MVP
- AI recommendation engine
- Smart reminders based on behavior patterns
- AI summarization and recommendations in the core workflow
- Support for inviting many users beyond the two main users
- Full replacement of all third-party tools
- Advanced analytics and forecasting
- Enterprise-grade collaboration features

## V1.5 / Later Features
- AI recommendations for planning and reminders
- AI summaries of recent tasks, events, or spending
- Better document understanding for ambiguous financial rows
- Broader automation around recurring life admin

## UX / Design Requirements
- Simple
- Rounded
- iOS-like
- Calm and clean
- Mobile-first

## Key Screens
- Dashboard
- Shared to-do view
- Calendar / timeline view
- Financial dashboard
- Shared files hub

## Success Metrics
### Short Term
- Both users regularly add and complete tasks
- Financial PDFs can be uploaded and reviewed successfully
- The dashboard becomes a recurring overview tool

### Medium Term
- Yumami becomes part of the couple's weekly planning and admin rhythm
- More modules can be added without making the app feel cluttered
- The product structure supports later AI layering cleanly

## Constraints
- Budget should stay as close to free as possible
- MVP target is 1-2 months
- Web-first launch, mobile later
- Privacy matters; architecture should remain compatible with a more private/self-hosted future
- The build should support learning, not just black-box code generation
