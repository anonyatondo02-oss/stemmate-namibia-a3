# ADR-003: Separate Draft and Completed Session Plans

**Project:** STEMMate Namibia  
**Version:** v2.0  
**Date:** 5 November 2026  
**Status:** Accepted  
**Owner:** Veueza Kavetuna (Requirements and Architecture)  
**Requirements:** FR-03, FR-04, FR-05

## 1. Context

In the earlier STEMMate prototype, facilitators could not save a plan until all required information was entered.

This created a problem for facilitators who needed to stop working before finishing a plan.

The A3 feedback also showed that the difference between an unfinished plan and a completed plan needed to be clearer.

We needed a solution that would allow unfinished work to be saved without treating incomplete plans as ready for use.

## 2. Options Considered

### Option A: Only Allow Saving Complete Plans

Advantages:
- Every saved plan contains the required information.
- Simple plan status.

Disadvantages:
- Facilitators may lose unfinished work.
- Not suitable when users are interrupted.

### Option B: Save All Plans Without Validation

Advantages:
- Easy for facilitators to save work.
- Fewer steps.

Disadvantages:
- Incomplete plans could be treated as ready.
- Important information, including safety notes, could be missing.

### Option C: Separate Draft and Completed States

Advantages:
- Drafts can be saved even when incomplete.
- Completed plans must pass validation.
- Only Completed plans are eligible for synchronisation.
- Plan status is clearer to users.

Disadvantages:
- Requires an additional completion step.
- Users must understand the difference between Draft and Completed.
- Editing a Completed plan may return it to Draft.

## 3. Decision

We chose Option C: Separate Draft and Completed States.

A facilitator can save an unfinished plan as a Draft.

When the facilitator selects **Review and complete**, the application checks the required fields; on the review screen, **Mark plan completed** saves the plan as Completed.

If the information is valid, the plan becomes Completed.

If information is missing or incorrect, the plan is saved and remains a Draft, and the application shows an error summary and a message beside each field.

## 4. Reasons for the Decision

This approach protects unfinished work while ensuring that Completed plans contain the required information.

It supports FR-03 by validating plans before completion.

It supports FR-04 by allowing Drafts to be saved and recovered.

It also supports FR-05 because Draft plans must not enter the simulated synchronisation queue.

## 5. Trade-offs and Consequences

The application must clearly show whether a plan is Draft or Completed.

Facilitators must understand that saving a Draft does not mean the plan is ready for use.

The interface must also explain what happens when a Completed plan is edited.

The state and sequence diagrams must match this behaviour.

## 6. Evidence

- `src/planService.js`
- `src/validation.js`
- A3 feedback
- Requirements FR-03, FR-04 and FR-05
- Automated test run on v2.0, 5 November 2026 (`node --test`, 12 of 12 passed, run by Shealtiel): T04 (incomplete plan stays Draft), T05 (title-only Draft is saved), T05b (valid plan becomes Completed and queued) and T06b (editing a Completed plan reopens it as Draft) all passed
- Evaluation tasks E2 and E3 (results to be added after the evaluation sessions)
- Sequence and State Diagrams

## 7. Conclusion

Separating Draft and Completed plans makes STEMMate more reliable for facilitators working in environments where interruptions are common.

It allows unfinished work to be saved while ensuring that only validated plans are marked Completed.
