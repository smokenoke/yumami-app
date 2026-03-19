# Testing Strategy

## Frameworks
- **Unit Tests:** Vitest for TypeScript business logic, validation, and pure utilities
- **Integration Tests:** Vitest or framework-supported integration tests for server-side flows and data orchestration
- **E2E Tests:** Playwright for core user journeys
- **Python Tests:** Pytest for bank PDF parsing and transaction categorization helpers

## Coverage Priorities
- Task creation, completion, and shared visibility
- Dashboard summary query logic
- Financial PDF upload and parse pipeline
- Low-confidence categorization review flow
- Auth and household access control rules

## Rules & Requirements
- Critical shared-life workflows must not ship without verification.
- Do not skip tests to force progress.
- If a test fails, fix the implementation or the expectation before moving on.
- Add regression tests for bugs in parsing, categorization, or access control.

## Manual Checks
- Verify the dashboard works on mobile-sized and desktop-sized viewports.
- Verify both users see the same shared tasks appropriately.
- Verify file links or uploaded documents are only visible to the right household.
- Verify PDF processing shows pending, success, and review-needed states clearly.
- Verify calendar visibility does not break when integration data is missing or stale.

## Before Commit / Milestone Verification
- Run `npm run lint`
- Run `npm test`
- Run a production verification build with `npm run build`
- Run relevant Playwright coverage for touched flows when available
- Run `pytest` for Python parsing changes when that module exists

## Execution
- **Run all app tests:** `npm test`
- **Run linting:** `npm run lint`
- **Run production build check:** `npm run build`
- **Run E2E tests:** `npx playwright test`
- **Run Python tests:** `pytest`

## Verification Loop
1. Plan the feature slice.
2. Implement the smallest useful increment.
3. Run the relevant checks.
4. Fix failures before continuing.
5. Update `MEMORY.md` with new decisions or quirks.
