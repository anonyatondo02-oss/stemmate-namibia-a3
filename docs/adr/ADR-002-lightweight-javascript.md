
# ADR-002: Use Plain HTML, CSS and JavaScript

**Project:** STEMMate Namibia  
**Version:** v2.0  
**Date:** 5 November 2026  
**Status:** Proposed — confirm script-loading method  
**Owner:** Shealtiel (Developer), with Architecture Team  
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

The A4 Architecture Guide recommends Option A: Plain HTML, CSS and JavaScript using ordinary scripts.

However, the A4 Role Guide also instructed the developer to use ES modules.

The final decision between ordinary scripts and ES modules must therefore be confirmed against the released v2.0 code before this ADR is marked Accepted.

The overall decision is to keep STEMMate lightweight and avoid a large framework.

## 4. Reasons for the Decision

A lightweight application is suitable for users with limited mobile data and older devices.

It also allows the team to maintain the application without a complicated development environment.

The plan logic is separated into the following files:

- `src/validation.js`
- `src/planService.js`
- `src/storage.js`

This makes the code easier to understand and test.

## 5. Trade-offs and Consequences

Using plain JavaScript means the team must organise the code carefully and manage the interface without a framework.

The team must also document how the application is opened and tested offline.

If ES modules are used, the offline instructions must account for browser restrictions when opening local files.

## 6. Evidence

- `index.html`
- `src/validation.js`
- `src/planService.js`
- `src/storage.js`
- v2.0 commit `6758079` (verify against GitHub)
- README instructions
- Component and Deployment Diagrams

## 7. Conclusion

A lightweight HTML, CSS and JavaScript application is appropriate for STEMMate because it reduces complexity and supports affordable deployment.

Before final submission, the developer must confirm whether ordinary scripts or ES modules are used in v2.0.
