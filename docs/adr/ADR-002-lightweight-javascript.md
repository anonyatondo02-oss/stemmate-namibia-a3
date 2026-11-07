# ADR-002: Use Plain HTML, CSS and JavaScript

**Project:** STEMMate Namibia  
**Version:** v2.0  
**Date:** 5 November 2026  
**Status:** Accepted  
**Owner:** Shealtiel Nyatondo (Developer); recorded by Veueza Kavetuna (Requirements and Architecture)  
**Requirements:** QR-03, Maintainability

## 1. Context

STEMMate Namibia is intended for use on affordable smartphones where mobile data may be expensive.

The application must be lightweight and easy for a small team to maintain.

We needed to choose a development approach that would not require complicated tools or large downloads.

## 2. Options Considered

### Option A: Plain HTML, CSS and JavaScript with Ordinary Scripts

Advantages:
- Small application size.
- No complicated build process.
- Easy to deploy through GitHub Pages.
- Can support opening a downloaded copy directly in a browser.

Disadvantages:
- Screen behaviour must be managed manually.
- Larger applications may become harder to organise.

### Option B: A Framework Such as React

Advantages:
- Provides tools for managing larger interfaces.
- Supports reusable interface components.

Disadvantages:
- Introduces additional dependencies.
- Usually requires a build process.
- Can increase maintenance complexity for a small team.

### Option C: Plain JavaScript Using ES Modules

Advantages:
- Separates code into smaller files.
- Makes dependencies easier to understand.
- Supports modern JavaScript development.

Disadvantages:
- Opening ES modules directly from a local file may be restricted by browser security rules.
- A local development server may be required.

## 3. Decision

We chose Option A: Plain HTML, CSS and JavaScript loaded as ordinary scripts.

This was confirmed against the released v2.0 code: `index.html` loads `src/validation.js`, `src/storage.js` and `src/planService.js` with plain `<script src>` tags (no `type="module"`). Each file exposes itself in two ways: as a browser global (`STEMValidation`, `STEMStorage`, `STEMPlans`) and as a Node export, so the same files run in the browser and in the automated tests.

An earlier version of the team Role Guide mentioned ES modules. That wording was an error and was corrected on 6 November 2026; the built code has always used ordinary scripts.

## 4. Reasons for the Decision

A lightweight application is suitable for users with limited mobile data and older devices.

It also allows the team to maintain the application without a complicated development environment.

Ordinary scripts were chosen over ES modules (Option C) for two specific reasons:

- **Offline fallback:** browsers refuse to load ES modules from a file opened by double-click (`file://`). Ordinary scripts still work, so a downloaded copy of the app opens with no internet connection.
- **Testing:** the same files run unchanged in Node's built-in test runner, so the plan logic is tested without a browser or any extra tools.

The whole app is small: about 61 KB for `index.html` and about 10 KB for the three `src` files.

The plan logic is separated into the following files:

- `src/validation.js`
- `src/planService.js`
- `src/storage.js`

This makes the code easier to understand and test.

## 5. Trade-offs and Consequences

Using plain JavaScript means the team must organise the code carefully and manage the interface without a framework.

The team must also document how the application is opened and tested offline.

Each module needs a small wrapper so it works both as a browser global and as a Node export. `index.html` is still large and holds the screen logic, so splitting it further is recommended for the next version.

## 6. Evidence

- `index.html`
- `src/validation.js`
- `src/planService.js`
- `src/storage.js`
- v2.0 commit `6758079`
- Automated test run on v2.0, 5 November 2026 (`node --test`, 12 of 12 passed, run by Shealtiel): all 12 automated tests loaded the modules in Node
- README instructions
- Component and Deployment Diagrams

## 7. Conclusion

A lightweight HTML, CSS and JavaScript application is appropriate for STEMMate because it reduces complexity and supports affordable deployment.

The script-loading method was confirmed against the v2.0 code on 6 November 2026: ordinary scripts.
