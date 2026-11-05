# STEMMate Namibia: A4 vertical slice

Team: STEMmate GIT · SDN621S Software Design, 2026
Release: **v2.0** (A4 slice, used for testing and evaluation)
Live prototype: https://anonyatondo02-oss.github.io/stemmate-namibia-a3/

STEMMate helps STEM facilitators plan practical sessions with the materials they have, on shared phones with unreliable signal. The A4 vertical slice is **create and save a session plan**: screen, validation, application logic, on-device storage and a visible result. All accounts, activities and plans are synthetic; no learner data is collected.

## Run it
- **Online:** open the live link above. No login or install.
- **Offline:** download this repository, keep the folder structure, and double-click `index.html`. It runs from the files with no internet connection.
- Sign in as **Facilitator F-01** or **F-02** (fictional, no password).

## Try the slice
1. Browse activities, open one, select **Create session plan**. It is saved straight away as a **Draft**.
2. Close the tab and reopen the app. The draft is still in **Session plans** under Drafts.
3. **Continue draft**, leave the date empty and select **Review and complete**: the errors are listed and shown next to each field, and the work stays saved as a Draft.
4. Fill in the date, **Review and complete**, then **Mark plan completed**. The plan is now **Completed** and queued to sync.
5. Record participation counts on the completed plan (numbers only).
6. Use **Demo & help** to simulate going offline, a failed sync or a version conflict.

## Run the automated tests
Requires Node.js 20 or later (nodejs.org). No other installs.
```
node --test
```
or `npm test`. Expected: 12 tests, 12 pass.

## Structure
| Path | Purpose |
|---|---|
| `index.html` | Screens and interaction |
| `src/validation.js` | Required-field, date, duration and participation-count rules (FR-03, FR-06) |
| `src/planService.js` | Draft and Completed logic, participation, sync state (FR-03, FR-04) |
| `src/storage.js` | Plan Repository over device storage; error results instead of crashes (FR-04, QR-02) |
| `tests/` | Automated tests T01 to T08 from the team test matrix |
| `alt/visual-layer.html` | A team member's alternative visual design, merged into v1.1 |

## Versions
| Version | Change |
|---|---|
| v2.0 | A4 slice: plan feature split into tested modules; Draft vs Completed states; completion message kept on screen |
| v1.1 | A3 release: baseline gaps, accessibility fixes, visual layer merged |
| v1.0 | First team build |

## Known limitations
- Synchronisation with the outreach unit is simulated; there is no server.
- Plans live in this browser only. Clearing browser data deletes them; use **Export plan** to keep a copy.
- Accounts are fictional and have no passwords.

## AI use
v1.0 was built with OpenAI ChatGPT/Codex coding assistance. v1.1 and v2.0 changes were made with Anthropic Claude coding assistance. Full declaration in the team report.
