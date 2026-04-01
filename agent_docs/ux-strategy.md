# Yumami UX Strategy

## Purpose
This document translates the accepted UX discovery answers into a concrete product experience strategy for Yumami.

Yumami is no longer in the stage where the main goal is proving that modules can coexist on one page. That has already been proven. The next goal is to turn the existing feature surface into a calm, coherent product that feels intentionally designed for a shared household.

## Product Experience North Star
Yumami should feel:
- calm
- organized
- warm
- private
- reassuring
- personal
- capable
- not corporate

Yumami should not feel like:
- enterprise software
- a cluttered admin portal
- a spreadsheet tool
- a generic productivity dashboard
- a family social network

## Core Product Positioning
Yumami should become:
- a calm shared-life dashboard first
- a household command center second
- a planner/admin app third

This means the product should prioritize orientation, clarity, and trust over feature density.

## Primary User Need
When a user opens Yumami, the app should quickly answer:
- What needs attention?
- What is coming up next?
- Is there anything important to review or act on together?

## 5-Second Home Screen Goals
Within 5 seconds, the user should understand:
1. what needs attention today or this week
2. what the next shared calendar event is
3. whether finances or admin need review

## Most Frequent Actions
The product should optimize for these recurring actions:
1. add or check a shared task
2. check the next calendar commitment
3. review or categorize a finance item

These actions should be fast, obvious, and available from the home experience without forcing deep navigation.

## UX Principles
### 1. Home Is For Orientation, Not Exhaustion
The home screen should summarize the household state. It should not fully render every module in detail.

### 2. Modules Need Dedicated Space
Tasks, Calendar, Finance, and Files should each have their own page. The dashboard should show only the most important slice of each.

### 3. Use Progressive Disclosure
Show the signal first, then let the user go deeper. Do not place full task boards, full finance review tables, and full calendar management on the same page by default.

### 4. Shared-Household Context Must Stay Visible
The product should consistently reinforce that this is a shared system:
- shared tasks
- shared events
- shared files
- shared finance review

### 5. Calm Beats Dense
Fewer, clearer surfaces are better than one long comprehensive surface.

### 6. Useful Now, Smarter Later
AI remains a later layer. The UX should first make human workflows clear and trustworthy.

## Information Architecture
## Primary Structure
The app should be organized into 5 top-level areas:
1. Home
2. Tasks
3. Calendar
4. Finance
5. Files

## Role Of Each Area
### Home
Purpose:
- orient the household
- show what matters next
- provide fast entry into common actions

Home should contain:
- next upcoming event
- urgent or open tasks
- finance review alerts
- quick access to important files or pinned items
- quick actions

Home should not contain:
- the full task board
- the full finance review workflow
- the full file hub
- all upcoming events in long detail

### Tasks
Purpose:
- focused task planning and execution

Tasks page should contain:
- full shared task list/board
- filtering by status
- task editing
- archive/completed access later

### Calendar
Purpose:
- shared schedule visibility and event management

Calendar page should contain:
- upcoming events
- calendar sources
- manual event creation
- later sync visibility and richer time views

### Finance
Purpose:
- finance intake, categorization, and monthly overview

Finance page should contain:
- statement imports
- transaction review
- category management
- monthly rollups

### Files
Purpose:
- central shared access to important references and documents

Files page should contain:
- shared links
- categories or pinned links later
- quick household reference access

## Navigation Strategy
## Recommended Navigation For Mobile-First Web
Use a bottom tab bar with 5 tabs:
- Home
- Tasks
- Calendar
- Finance
- Files

Why this is the right fit:
- these are the natural mental buckets already proven in the product
- bottom tabs are familiar and fast on mobile
- they reduce the feeling of one giant page
- they make the app feel like a real product instead of an integration surface

## Secondary Navigation
Within each module page, use:
- lightweight page-level sub-sections
- inline filters and chips
- clear page headers with quick actions

Avoid a heavy side navigation pattern for v1 web/mobile-first design.

## Home Dashboard Strategy
## Home Content Hierarchy
The home dashboard should be structured in this order:
1. Household snapshot / hero
2. What needs attention now
3. Next upcoming event
4. Open tasks preview
5. Finance review preview
6. Quick access / files preview
7. Quick actions

## Recommended Home Sections
### Section 1: Household Snapshot
Should answer:
- are we in a calm or busy moment?
- how many open tasks exist?
- what is next?

### Section 2: Attention Queue
A small list of the most urgent cross-module items, such as:
- overdue or high-priority task
- finance review count
- upcoming admin event

This becomes the true heartbeat of the home screen.

### Section 3: Next Event Card
A dedicated card for the next shared commitment.

### Section 4: Tasks Preview
Show only the most relevant tasks, for example:
- top 3 open tasks
- or today/this week tasks

Include a clear "View all tasks" action.

### Section 5: Finance Preview
Show only:
- review-needed count
- latest monthly net summary
- one or two high-signal items

Do not show the full transaction table here.

### Section 6: Files Preview
Show:
- pinned or most-used links later
- for now, a compact quick-access slice

### Section 7: Quick Actions
Recommended quick actions:
- add task
- add event
- add transaction
- open files

## Home Layout Recommendation
Use a mostly fixed layout in v1.

Reason:
- fixed structure creates calm and consistency
- personalization can come later
- widget customization belongs to roadmap, not first redesign

Later roadmap:
- reorder dashboard widgets
- hide sections
- choose home emphasis
- pin favorite files or modules

## Module Surface Strategy
## Tasks
Tasks should feel:
- focused
- lightweight
- immediately actionable

Tasks should not be visually buried under finance or calendar concerns.

## Calendar
Calendar should feel:
- time-oriented
- clear
- less dense than a full enterprise calendar product

Tasks and calendar should be separate but connected.
They should not collapse into one blended planning view in the first redesign.

## Finance
Finance should feel:
- structured
- trustworthy
- reviewable
- calm rather than accountant-heavy

On home:
- summary only

On Finance page:
- full workflow

## Files
Files should feel:
- reference-oriented
- accessible
- lightweight

Files should support the household memory function of Yumami without dominating the app.

## Interaction Philosophy
### Quick To Read
Cards and summaries should be scannable in seconds.

### Quick To Enter
Common actions should require minimal effort.

### Deep Only When Needed
Detailed workflows belong in module pages.

### Shared Context Everywhere
The language and UI should reinforce shared ownership and collaboration.

## Visual Direction
The visual direction should lean toward:
- Apple-style clarity and restraint
- Things-style softness and calm hierarchy
- Notion Calendar's unified sense of time-awareness
- Cozi / FamilyWall practicality without their visual clutter

This suggests:
- rounded surfaces
- careful whitespace
- low-noise typography
- restrained color usage
- one clear accent system
- status conveyed by meaning, not visual overload

## What The Current UI Got Right
The current product already proved:
- module viability
- household-scoped structure
- dashboard as central hub
- real workflows for tasks, files, finance, and calendar

## What The Current UI Must Change
The current single long page should evolve into:
- a real home dashboard
- dedicated module pages
- lighter previews instead of full stacked modules
- a more intentional navigation model

## Recommended Next Deliverables
The next design/implementation phase should produce:
1. a route and navigation plan
2. a redesigned Home page
3. dedicated pages for Tasks, Calendar, Finance, and Files
4. a reusable layout shell with bottom-tab navigation
5. reduced dashboard density through previews and drill-downs
6. a cleaner visual system for cards, section headers, and actions

## Success Criteria For The UX Pass
The redesign is successful if:
- the app no longer feels like one long page
- the home screen feels calm and immediately understandable
- modules feel like parts of one product, not separate demos
- core actions are faster to reach
- the product feels appropriate for a real shared household
