# ADR-001: Store Session Plans on the Device

**Project:** STEMMate Namibia  
**Version:** v2.0  
**Date:** 5 November 2026  
**Status:** Accepted  
**Owner:** Veueza Kavetuna (Requirements and Architecture)  
**Requirements:** FR-04, QR-02, QR-03

## 1. Context

STEMMate Namibia is designed for facilitators who may work in areas where internet access is unreliable or expensive.

Facilitators need to create session plans and save their progress even when they are offline. The team also does not have the resources to maintain a dedicated online database.

We needed a simple and affordable way to store session plans.

## 2. Options Considered

### Option A: Browser Local Storage
Save plans directly on the user's device through the browser.

Advantages:
- Works without an internet connection once the application is available.
- Does not require a paid server.
- Simple to implement and maintain.
- Suitable for storing a small number of plans.

Disadvantages:
- Storage space is limited.
- Plans can be lost if browser data is cleared.
- Plans are not automatically available on other devices.

### Option B: IndexedDB
Use a more advanced browser database.

Advantages:
- Can handle larger amounts of information.
- Supports more complex data.

Disadvantages:
- More complicated to implement.
- Not necessary for the small amount of data currently used.

### Option C: Online Database
Store plans on a remote server.

Advantages:
- Information could be accessed from different devices.
- Central backups and sharing would be possible.

Disadvantages:
- Requires internet connectivity.
- May involve hosting costs.
- Requires additional security and account management.

## 3. Decision

We chose Option A: Browser Local Storage.

The application stores session plans locally using the storage logic in `src/storage.js`.

This allows facilitators to save Draft plans without depending on an online server.

## 4. Reasons for the Decision

Local storage best suits the current needs of STEMMate.

It is affordable, works with unreliable connectivity and is simple enough for a small development team to maintain.

It also supports FR-04, which requires unfinished plans to be saved and recovered.

## 5. Trade-offs and Consequences

The main limitation is that locally stored plans can be lost if browser data is cleared or the device becomes unavailable.

Exporting plans is therefore an important backup measure.

The application will also need a real synchronisation service in the future if plans must be shared across devices.

Keeping storage logic separate from the Plan Service makes it easier to change the storage method later.

## 6. Evidence

- `src/storage.js`
- `src/planService.js`
- Requirements FR-04 and QR-02
- Automated test run on v2.0, 5 November 2026 (`node --test`, 12 of 12 passed, run by Shealtiel): T06 (plans survive a restart) and T08 (a failed write returns an error instead of crashing) both passed
- v2.0 commit `6758079`
- Component and Deployment Diagrams

## 7. Conclusion

Browser local storage is the most suitable option for the current STEMMate prototype because it supports offline work without adding unnecessary costs or complexity.
