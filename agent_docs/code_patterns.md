# Code Patterns

## Architectural Pattern
- Use a modular monolith.
- Organize work by feature.
- Keep server-side orchestration separate from UI components.
- Keep database queries in dedicated modules.

## Preferred Patterns
- Validate inputs before mutation.
- Use optimistic UI carefully and only where rollback is simple.
- Keep asynchronous document processing explicit with status fields.
- Prefer deterministic rules for transaction categorization in MVP.

## Avoid
- Putting database calls directly in visual components
- Mixing PDF parsing logic into route handlers
- Introducing AI-generated summaries into MVP critical paths
- Large untyped objects crossing feature boundaries
