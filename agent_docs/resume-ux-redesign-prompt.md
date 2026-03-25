# Codex Resume Prompt For UX/UI Phase

Use this prompt on another computer inside the cloned Yumami repo.

```text
Read AGENTS.md, MEMORY.md, README.md, PRD-Yumami-MVP.md, TechDesign-Yumami-MVP.md, and agent_docs/ first.

Important context:
- The app has completed Phase 7.
- Tasks, files, finance workflow, and calendar visibility are already built.
- The repo's current next priority is a dedicated UX/UI reorganization pass.
- Do not jump to new feature work yet.
- Treat MEMORY.md as the source of truth.

Then do the following in order:
1. Confirm the current project phase and summarize what has already been built.
2. Read agent_docs/ux-discovery-questionnaire.md and use it as the main UX discovery input.
3. If the questionnaire is partially answered, work from the answers that exist and clearly note what is still assumed.
4. Produce a UX strategy for Yumami based on this direction:
   - calm
   - organized
   - grounded in the real difficulties of a shared household
   - not corporate
   - not one long stacked page
5. Propose a new information architecture.
6. Propose the navigation structure for mobile-first web.
7. Propose which modules belong on the dashboard versus dedicated pages.
8. Propose the new home/dashboard layout and hierarchy.
9. Explain the redesign in beginner-friendly language.
10. Stop before implementation and ask for approval.

Constraints:
- Preserve the existing product direction and data model.
- Do not remove working functionality.
- Do not start AI features.
- Optimize for a calm, intentional, mobile-first experience.
- The redesign should turn the current long integration page into a clearer product structure.
```
