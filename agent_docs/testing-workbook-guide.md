# Yumami Testing Workbook Guide

Workbook:
- `agent_docs/yumami-testing-matrix-template.xlsx`

## Sheets
### Overview
Explains the purpose of the workbook, the main testing lenses, and the recommended cadence.

### Scenario Log
Use this for full scenario-based testing.
Best for documenting:
- real household workflows
- expected vs actual outcome
- pain points
- ideas for redesign or fixes

### UX Scorecard
Use this after a session to score the experience from 1 to 5 on:
- speed
- clarity
- trust
- usefulness
- calmness

### Heuristic Review
Use this to evaluate the product against UX quality questions such as:
- clarity
- hierarchy
- effort
- consistency
- trust
- emotional quality
- shared-household realism

### Regression Checklist
Use this after code changes to make sure the app still works across:
- routes
- navigation
- task flows
- calendar flows
- finance flows
- files flows
- responsive layout

### Weekly Log
Use this during real-life usage over multiple weeks.
This helps identify:
- what gets used most
- what feels valuable
- where friction repeats
- what should be improved next

## Best Testing Routine
1. Pick one real household scenario.
2. Log it in `Scenario Log`.
3. Score the experience in `UX Scorecard`.
4. Add broader UX notes in `Heuristic Review` if needed.
5. After any code change, run `Regression Checklist`.
6. Keep a weekly summary in `Weekly Log`.

## Suggested Real-Life Scenarios
- Morning check-in
- Add and complete a shared task
- Check upcoming schedule
- Monthly finance review
- Find important file

## Goal
The goal is not just to catch bugs.
The goal is to understand:
- whether Yumami works technically
- whether it feels clear
- whether it reduces friction in a shared household
- whether the product is becoming something you would actually use every day
