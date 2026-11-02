# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Agentic Workflow Discipline (Always-Active)

Distilled from project conventions. Does not repeat what `./.claude/rules/development-rules.md` already states (KISS/DRY/YAGNI, file naming, pre-commit, linting) — only the parts not covered there.

- **TDD Requirement**: For any new feature or bug fix, create or update unit tests *first* or in parallel.
- **Closed-Loop Verification**: Before marking a task complete, run the project's real test command (`npm test`) in terminal. Do not report success until 100% of relevant test cases pass.
- **Review-Before-Run**: Treat generated code as a first draft. Verify edge cases (null inputs, auth boundaries, empty states, error handling) before integrating, not after.
- **Directory & Code Exploration**: Use strategic, semantic-first search before changing unfamiliar code paths.
- **Prompting Standards (5S)** for writing task prompts to sub-agents or for the user to reuse: Structured (separate instructions from code via `{{{ CODE }}}`), Surrounding Context (env details, error traces, file paths, versions), Single Task (one sub-goal per interaction), Specific Instructions (exact constraints), Short (no conversational fluff).

## Conditional Rules (apply only once the trigger is confirmed true in this repo/session)

| Trigger | Rule that activates |
|---|---|
| Adding a new cross-cutting concern (logging, auth, rate-limiting, input validation) to a route/handler | Separate it from business logic via a decorator/middleware wrapper rather than inlining it. |
| **Playwright MCP server** is connected in session | Use it for E2E/GUI verification (layout, click flows, UI check-items) on frontend work. |
| **GitHub MCP server** is connected in session | Use it to inspect PR diffs, check issues, create structured PRs. |

Do not pre-apply a conditional rule before its trigger is actually true — e.g. do not force a decorator wrapper where no real cross-cutting concern exists, do not assume Playwright/GitHub MCP tools exist unless connected this session.

## Workflows

- Primary workflow: `./.claude/rules/primary-workflow.md`
- Development rules: `./.claude/rules/development-rules.md`
- Orchestration protocols: `./.claude/rules/orchestration-protocol.md`
- Documentation management: `./.claude/rules/documentation-management.md`
- And other workflows: `./.claude/rules/*`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** DO NOT modify skills in `~/.claude/skills` directory directly. **MUST** modify skills in this current working directory. Unless you are asked to do so.
**IMPORTANT:** You must follow strictly the development rules in `./.claude/rules/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

## Git

**DO NOT** use `chore` and `docs` in commit messages of file changes in `.claude` directory.

## Hook Response Protocol

### Privacy Block Hook (`@@PRIVACY_PROMPT@@`)

When a tool call is blocked by the privacy-block hook, the output contains a JSON marker between `@@PRIVACY_PROMPT_START@@` and `@@PRIVACY_PROMPT_END@@`. **You MUST use the `AskUserQuestion` tool** to get proper user approval.

**Required Flow:**

1. Parse the JSON from the hook output
2. Use `AskUserQuestion` with the question data from the JSON
3. Based on user's selection:
   - **"Yes, approve access"** → Use `bash cat "filepath"` to read the file (bash is auto-approved)
   - **"No, skip this file"** → Continue without accessing the file

**Example AskUserQuestion call:**
```json
{
  "questions": [{
    "question": "I need to read \".env\" which may contain sensitive data. Do you approve?",
    "header": "File Access",
    "options": [
      { "label": "Yes, approve access", "description": "Allow reading .env this time" },
      { "label": "No, skip this file", "description": "Continue without accessing this file" }
    ],
    "multiSelect": false
  }]
}
```

**IMPORTANT:** Always ask the user via `AskUserQuestion` first. Never try to work around the privacy block without explicit user approval.

## Python Scripts (Skills)

When running Python scripts from `.claude/skills/`, use the venv Python interpreter:
- **Linux/macOS:** `.claude/skills/.venv/bin/python3 scripts/xxx.py`
- **Windows:** `.claude\skills\.venv\Scripts\python.exe scripts\xxx.py`

This ensures packages installed by `install.sh` (google-genai, pypdf, etc.) are available.

**IMPORTANT:** When scripts of skills failed, don't stop, try to fix them directly.

## [IMPORTANT] Consider Modularization
- If a code file exceeds 200 lines of code, consider modularizing it
- Check existing modules before creating new
- Analyze logical separation boundaries (functions, classes, concerns)
- Use kebab-case naming with long descriptive names, it's fine if the file name is long because this ensures file names are self-documenting for LLM tools (Grep, Glob, Search)
- Write descriptive code comments
- After modularization, continue with main task
- When not to modularize: Markdown files, plain text files, bash scripts, configuration files, environment variables files, etc.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*