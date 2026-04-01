# Yumami Information Architecture And Screen Blueprint

## Purpose
This document turns the UX strategy into a concrete product structure that can guide the redesign implementation.

The goal is to replace the current long stacked integration page with a clear, mobile-first product architecture.

## Top-Level Navigation
Use a bottom tab bar with 5 destinations:
1. Home
2. Tasks
3. Calendar
4. Finance
5. Files

This should be the primary navigation pattern for the mobile-first web experience.

## Route Map
Recommended first route structure:
- `/`
  - Home dashboard
- `/tasks`
  - Full shared task workspace
- `/calendar`
  - Calendar visibility and event management
- `/finance`
  - Finance intake, transaction review, and monthly summaries
- `/files`
  - Shared file links and reference access

Possible later routes:
- `/settings`
- `/profile`
- `/household`
- `/insights`

These later routes should not distract from the current MVP redesign.

## Global Layout Shell
The redesign should introduce a reusable layout shell that contains:
- top app bar / compact header
- main scrollable content area
- bottom tab navigation
- optional floating quick action entry point later

## Global Header Strategy
The header should be lightweight and contextual.

Home header should emphasize:
- household identity
- overall household state

Module page headers should emphasize:
- page title
- one-line page purpose
- 1-2 primary actions

Avoid oversized hero headers on every page.

## Home Screen Blueprint
## Home Purpose
The home screen is the household orientation surface.
It should answer:
- what matters now
- what is next
- what needs review
- where to go next

## Home Screen Structure
Recommended order:
1. Household summary header
2. Attention queue
3. Next event card
4. Task preview
5. Finance preview
6. Files preview
7. Quick actions row

## Home Section Details
### 1. Household Summary Header
Contents:
- household name
- short calm status line
- open tasks count
- next event timing

This should be visually clean and not overly tall.

### 2. Attention Queue
Purpose:
- surface the most important 2-4 items across the whole household system

Examples:
- one overdue task
- one finance review item
- one upcoming commitment
- one important reminder signal later

This should be a compact stacked list or card group.

### 3. Next Event Card
Purpose:
- make the immediate schedule visible without opening the calendar page

Contents:
- event title
- time
- location if relevant
- related calendar source if useful
- CTA: `Open Calendar`

### 4. Task Preview
Purpose:
- show only the most relevant task slice

Contents:
- top 3 open tasks
- status chips
- CTA: `View All Tasks`
- quick add task affordance

### 5. Finance Preview
Purpose:
- make finance visible without overwhelming the home screen

Contents:
- review-needed count
- latest monthly net
- one small supporting line such as number of imports or pending uncategorized items
- CTA: `Open Finance`

### 6. Files Preview
Purpose:
- provide quick access to household references

Contents:
- 3-4 high-value links or recent/pinned references later
- CTA: `Open Files`

### 7. Quick Actions
Purpose:
- make frequent input actions easy

Recommended quick actions:
- add task
- add event
- add transaction
- open file link area

This can be a compact action row, not a huge block.

## Home UX Rules
- no full boards
- no full tables
- no detailed management views
- every section should preview, not expand into full workflow

## Tasks Screen Blueprint
## Purpose
The Tasks page is the dedicated action/workflow surface for shared tasks.

## Recommended Structure
1. Page header
2. Quick add task
3. Status filters
4. Main task list/board
5. Optional archived/completed access later

## Header Contents
- title: `Tasks`
- support line: e.g. `Shared household work, organized clearly`
- primary action: `Add task`

## Main Content
The current task functionality should move here:
- task composer
- task list or grouped sections
- task editing
- status progression
- archive actions

## Preferred Layout Direction
Instead of a long stack of task cards mixed with other modules, this page should feel focused and operational.

## Calendar Screen Blueprint
## Purpose
The Calendar page is the dedicated schedule surface.

## Recommended Structure
1. Page header
2. Next upcoming event summary
3. Upcoming events list
4. Calendar sources section
5. Add event form
6. Add calendar source form

## Header Contents
- title: `Calendar`
- support line: e.g. `Shared schedule visibility for your household`
- primary action: `Add event`

## Main Content Priorities
- events first
- sources second

Reason:
users usually care more about upcoming commitments than source configuration.

## Future Expansion
Later this page can support:
- calendar timeline/week view
- imported synced events
- event grouping by source or date

## Finance Screen Blueprint
## Purpose
The Finance page is the structured review and monthly overview surface.

## Recommended Structure
1. Page header
2. Monthly rollup cards
3. Statement imports section
4. Transaction review section
5. Categories section
6. Add transaction / add import actions

## Header Contents
- title: `Finance`
- support line: e.g. `Shared financial review and monthly structure`
- primary action: `Add transaction`
- secondary action: `Add import`

## Main Content Priorities
- monthly rollups first
- transactions second
- category management third

Reason:
users should understand financial state before diving into review mechanics.

## Files Screen Blueprint
## Purpose
The Files page is the household memory and reference surface.

## Recommended Structure
1. Page header
2. Important/pinned links area
3. Shared links list
4. Add link action/form
5. Category or grouping support later

## Header Contents
- title: `Files`
- support line: e.g. `Important shared links and household references`
- primary action: `Add link`

## Main Content Priorities
- high-value references first
- full list second

## Page Density Strategy
Across all module pages:
- use fewer larger sections instead of many small cards
- avoid overly tall intro copy
- keep actions close to the content they affect
- reduce repetitive explanatory text once the UX is cleaner

## Navigation Behavior
## Bottom Tabs
Recommended tab order:
- Home
- Tasks
- Calendar
- Finance
- Files

Why this order:
- Home is the anchor
- Tasks and Calendar are most frequent shared-life actions
- Finance is important but less frequent in daily use
- Files is useful but more reference-oriented

## Tab Behavior
- active tab clearly highlighted
- preserve scroll/position later if feasible
- page titles should match tab labels exactly for clarity

## Mobile-First Layout Guidance
- single-column by default
- section stacking should feel deliberate and short
- multi-column layouts only on wider screens
- bottom navigation should remain primary on small screens

## Content Hierarchy Rules
### Home
Overview first

### Tasks
Action first

### Calendar
Time awareness first

### Finance
Review and summary first

### Files
Reference access first

## Quick Action Strategy
The product should support fast creation actions, but not all on the same screen in full detail.

Recommended immediate actions by page:
- Home: quick action launch points only
- Tasks: full add task
- Calendar: full add event
- Finance: full add transaction/import
- Files: full add link

## What Gets Removed From The Current Home Page
The redesigned Home page should remove:
- full task workflow
- full finance workflow
- full calendar management
- full files management
- long repeated descriptive sections

The dashboard should stop behaving like the master implementation page.

## Implementation Sequence Recommendation
When redesign begins, implement in this order:
1. create reusable app shell with bottom navigation
2. split current content into route-level pages
3. redesign Home as a preview/overview page only
4. move full workflows into their module pages
5. tighten copy, spacing, and hierarchy
6. only after that refine visuals and interactions further

## Success Criteria
The IA and screen redesign is successful if:
- the app feels like one product with 5 clear destinations
- Home becomes a calm overview instead of a long implementation surface
- each module page has a clear job
- common actions are easier to find
- the structure supports later customization without needing a major rewrite
