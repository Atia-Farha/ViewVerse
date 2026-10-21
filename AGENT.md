# Coding Agent's Guide

## 1. Purpose

This file defines the mandatory development rules, coding standards, engineering principles, and behavioral expectations for AI coding agents working in this repository.

These rules apply to **all code, configuration, components, utilities, styles, tests, documentation, refactors, and dependency changes** unless a higher-priority instruction explicitly overrides them.

Agents must prioritize:

1. Correctness
2. Performance and smoothness
3. Maintainability
4. Simplicity
5. Consistency
6. Accessibility
7. Security
8. Developer experience

Do not introduce complexity without a concrete engineering reason.

---

# 2. Core Engineering Rules

## 2.1 Follow the Installed Stack

Always inspect the existing project before writing or modifying code.

Code must follow the conventions, APIs, patterns, and recommended usage of the **currently installed versions** of:

- Frameworks
- Libraries
- Modules
- Plugins
- Build tools
- Linters
- Formatters
- CSS tooling
- Package managers

Never intentionally use deprecated, legacy, or older conventions when the installed version provides a current recommended approach.

Do not copy implementation patterns from outdated tutorials, old documentation, or previous major versions.

When uncertain about an API:

1. Inspect the installed package/version.
2. Check the package's current documentation if necessary.
3. Follow the current recommended API.
4. Do not guess.

---

# 3. JavaScript Only

## 3.1 Mandatory JavaScript

All application code must be written in **JavaScript**.

Do **not** introduce TypeScript.

Do not create:

- `.ts` files
- `.tsx` files
- TypeScript interfaces
- TypeScript types
- TypeScript enums
- Type annotations
- Generic TypeScript syntax
- TypeScript-specific utility patterns

Use modern JavaScript features supported by the project's current tooling.

Prefer:

- `const`
- `let`
- Arrow functions where appropriate
- Destructuring
- Optional chaining
- Nullish coalescing
- ES modules
- Async/await
- Modern array/object methods

Avoid unnecessary language complexity.

---

# 4. Framework Conventions

Always follow the framework's **current official conventions**.

Do not fight the framework.

Prefer framework-provided functionality over manually recreating functionality that already exists.

Before introducing a custom abstraction, determine whether the framework already provides an appropriate solution.

Prefer:

- Framework-native routing
- Framework-native data fetching
- Framework-native state utilities
- Framework-native lifecycle APIs
- Framework-native composables/utilities
- Framework-native asset/build handling

Do not introduce custom infrastructure when an existing framework feature solves the same problem cleanly.

---

# 5. Dependency Rules

## 5.1 Minimize Dependencies

Do not install a package simply because it is convenient.

Before adding a dependency, determine whether the requirement can reasonably be solved using:

1. Existing project dependencies
2. Framework functionality
3. Browser APIs
4. Native JavaScript
5. Existing internal utilities/components

Add a dependency only when it provides meaningful value.

## 5.2 Avoid Duplicate Functionality

Never introduce multiple libraries that solve essentially the same problem.

Examples:

- Multiple state-management libraries
- Multiple HTTP clients
- Multiple UI frameworks
- Multiple animation libraries
- Multiple icon libraries
- Multiple date libraries
- Multiple utility libraries

Use the existing project solution unless there is a strong technical reason to change it.

## 5.3 Package Versions

Do not downgrade packages merely to make code work.

Do not pin an old version to use an obsolete API.

When changing dependencies:

- Use compatible current versions.
- Verify compatibility.
- Update code to the current API rather than adapting new packages to old patterns.

---

# 6. Component Architecture

## 6.1 Build Reusable Components

Prefer reusable components over repeated markup.

If a UI pattern appears more than once or is likely to be reused, extract it into a component.

Components should have:

- One clear responsibility
- Clear inputs
- Predictable outputs
- Minimal internal state
- Minimal coupling

Avoid creating extremely large components.

## 6.2 Do Not Over-Componentize

Do not create components for trivial markup solely to reduce file length.

A component should provide meaningful reuse, isolation, abstraction, or readability.

Avoid component hierarchies that make simple UI difficult to understand.

## 6.3 Component Naming

Use clear, descriptive names.

Names should communicate purpose rather than implementation details.

Prefer:

```text
MovieCard
SearchInput
EpisodeList
LoadingSkeleton
```

over vague names such as:

```text
Box
Thing
Item
Component1
Wrapper
```

---

# 7. Styling Rules

## 7.1 Prefer Design Tokens

Repeated visual values must be represented through reusable design tokens rather than repeatedly hard-coded throughout components.

Design tokens should be defined centrally using the project's existing Tailwind/CSS architecture.

Tokens may represent:

- Colors
- Typography
- Spacing
- Border radii
- Shadows
- Transitions
- Component dimensions
- Layout values
- Breakpoints where appropriate

## 7.2 Avoid Excessive Inline Utility Classes

Do not create unnecessarily long Tailwind class strings repeatedly inside templates.

Prefer reusable component classes and design tokens in the global stylesheet when a visual pattern is repeated.

For example, repeated patterns should become reusable styles rather than duplicating large class lists across many components.

However, do not move every Tailwind class into CSS.

Use Tailwind utility classes directly when the styling is:

- Local
- Simple
- One-off
- Clear
- Not repeated

Use reusable CSS/design tokens when a pattern is repeated or represents a meaningful design system concept.

## 7.3 Maintain Visual Consistency

Do not introduce arbitrary values when an existing design token or utility already represents the required value.

Before adding a new visual value, check whether an existing token can be reused.

---

# 8. Performance - Highest Priority

Performance and smoothness are **first-class requirements**.

Every implementation decision must consider:

- Initial load performance
- Runtime performance
- Rendering performance
- Memory usage
- Network usage
- JavaScript bundle size
- Image loading
- Interaction responsiveness
- Mobile performance
- Low-end device performance

Do not sacrifice performance for unnecessary abstraction or visual effects.

---

# 9. Rendering Performance

Avoid unnecessary rendering.

Prefer:

- Small components
- Stable reactive state
- Computed values for derived state
- Lazy rendering where appropriate
- Conditional rendering when content is genuinely unnecessary
- Efficient list rendering
- Minimal DOM size

Do not make large objects deeply reactive without a reason.

Do not create unnecessary watchers.

Do not perform expensive work inside templates.

Do not repeatedly calculate expensive values during rendering.

Move derived calculations into appropriate computed values or cached utilities.

---

# 10. Reactivity Rules

Use reactivity deliberately.

Prefer the simplest appropriate reactive primitive.

Do not make data reactive if it never changes.

Avoid:

- Unnecessary watchers
- Watchers that trigger other watchers
- Deep watchers unless required
- Reactive state for static constants
- Duplicate copies of the same state

Prefer derived state over duplicated state.

For example, if a value can be calculated from existing state, do not create a second reactive variable to store it.

---

# 11. Network Performance

Network requests must be intentional.

Before making a request, determine:

- Is it necessary?
- Is the data already available?
- Can it be reused?
- Can requests be combined?
- Can it be cached?
- Can duplicate requests be prevented?
- Does the current screen actually need it?

Avoid unnecessary API calls.

Avoid duplicate API calls.

Avoid fetching large datasets when only a small subset is required.

Do not request data for UI that is not currently needed unless there is a clear performance benefit.

---

# 12. Data Fetching

Use the framework's recommended data-fetching APIs.

Handle:

- Loading
- Success
- Empty results
- Errors
- Timeouts where applicable
- Aborted requests
- Stale requests
- Invalid responses
- Unexpected response structures

Search and user-driven requests should generally use:

- Debouncing where appropriate
- Request deduplication
- Stale-request protection
- Cancellation where supported
- Appropriate caching

Never allow an old asynchronous response to incorrectly overwrite newer state.

---

# 13. Caching

Cache data when doing so provides a meaningful performance benefit.

Avoid caching:

- Sensitive information
- Data that must always be fresh
- Excessively large objects without justification

Cache only what is useful.

Do not create multiple overlapping cache mechanisms without a clear reason.

---

# 14. Images and Media

Images and media must be performance-conscious.

Prefer:

- Appropriate image dimensions
- Modern supported formats
- Lazy loading below the fold
- Priority loading for critical visual content
- Reserved dimensions to prevent layout shift
- Responsive images when appropriate

Never load unnecessarily large assets.

Never load an original/full-resolution asset when a smaller appropriate version is available.

Do not load heavy media before it is needed.

---

# 15. Code Splitting and Lazy Loading

Use lazy loading when it meaningfully improves initial load performance.

Good candidates include:

- Heavy components
- Large feature modules
- Secondary UI
- Expensive visualizations
- Media/player functionality
- Rarely used functionality

Do not lazy-load tiny components merely for the sake of lazy loading.

The goal is to reduce initial work without creating unnecessary complexity.

---

# 16. JavaScript Bundle Discipline

Keep client-side JavaScript lightweight.

Avoid:

- Large libraries for trivial functionality
- Duplicate utilities
- Unused dependencies
- Large eagerly loaded modules
- Unnecessary polyfills
- Heavy libraries for simple UI effects

Prefer native browser APIs and existing project utilities when practical.

---

# 17. Animation and Smoothness

Animations must prioritize smoothness.

Prefer GPU-friendly properties such as:

- `transform`
- `opacity`

Avoid animating layout-heavy properties unnecessarily, such as:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`

Avoid excessive animations.

Animations should be:

- Short
- Purposeful
- Consistent
- Non-blocking
- Responsive

Respect:

```css
prefers-reduced-motion
```

when appropriate.

Never allow animations to noticeably delay interaction.

---

# 18. User Interaction Responsiveness

UI interactions should feel immediate.

Avoid blocking the main thread.

Do not perform expensive synchronous work during:

- Click handlers
- Input events
- Scroll events
- Resize events
- Pointer events

Use debouncing/throttling where appropriate.

Do not attach unnecessary global event listeners.

Clean up listeners, timers, observers, and subscriptions when required.

---

# 19. Error Handling

Every asynchronous operation must have an intentional failure path.

Do not assume:

- Network requests always succeed
- APIs always return valid data
- Data always exists
- IDs are always valid
- Arrays are never empty
- Images always load
- Local Storage is always available
- Browser APIs always behave normally

Handle realistic failure cases gracefully.

Errors should:

- Be detected
- Be handled
- Produce an appropriate user experience
- Avoid application crashes
- Avoid exposing sensitive implementation details

Do not silently swallow errors unless there is a deliberate reason.

---

# 20. Edge Cases

Agents must actively consider edge cases before considering an implementation complete.

Consider, where applicable:

- Empty arrays
- Missing values
- `null`
- `undefined`
- Invalid IDs
- Invalid URLs
- Duplicate records
- Missing images
- Missing metadata
- Network failure
- Slow network
- Offline behavior
- API rate limits
- API errors
- Malformed responses
- Rapid repeated clicks
- Repeated requests
- Race conditions
- Browser refresh
- Direct route access
- Back/forward navigation
- Mobile viewport sizes
- Very small screens
- Very large screens
- Long text
- Unusual characters
- Large datasets
- Local Storage failure
- Storage quota limits
- Expired data
- Stale data

Do not optimize only for the happy path.

---

# 21. Defensive Programming

Validate assumptions at boundaries.

External data must be treated as untrusted.

Validate:

- Route parameters
- User input
- API responses
- Local Storage data
- Query parameters
- External URLs

Do not blindly access nested properties without considering missing data.

Use safe access patterns where appropriate.

Do not rely solely on frontend validation for security-sensitive behavior.

---

# 22. Local Storage and Browser Storage

Browser storage must be treated as unreliable.

Always account for:

- Missing keys
- Invalid JSON
- Corrupted values
- Storage quota errors
- Browser privacy restrictions
- Disabled storage
- Unexpected data versions

Never allow malformed stored data to crash the application.

Store only the minimum required information.

Do not store secrets or sensitive credentials in browser storage.

---

# 23. Security

Security must be considered during implementation.

Never:

- Commit secrets
- Hard-code private API keys
- Expose credentials unnecessarily
- Trust external input blindly
- Inject unsanitized HTML
- Use dangerous dynamic code execution
- Disable security protections without a concrete reason

Do not use:

```js
eval();
```

or equivalent dynamic code execution unless explicitly required and formally justified.

Avoid unsafe HTML rendering.

External content must be treated as untrusted.

---

# 24. Accessibility

Accessibility is mandatory.

Use semantic HTML whenever possible.

Interactive elements must be keyboard accessible.

Use:

- Proper buttons for actions
- Proper links for navigation
- Labels for inputs
- Meaningful accessible names
- Appropriate ARIA only when necessary

Do not use a `<div>` as a button when a `<button>` is appropriate.

Ensure sufficient visual focus states.

Do not rely on color alone to communicate important information.

---

# 25. Responsive Design

All UI must work across supported viewport sizes.

Do not design exclusively for desktop.

Consider:

- Mobile
- Tablet
- Desktop
- Wide screens
- Small screens
- Touch interaction
- Keyboard interaction

Avoid fixed dimensions that unnecessarily break responsive layouts.

---

# 26. State Management

Use the smallest state-management solution that solves the problem.

Prefer framework-native state and composables before introducing an external state-management library.

Do not introduce global state for data that can remain local to a component.

Avoid duplicated state.

Keep state close to where it is used unless sharing is genuinely required.

Do not add a state-management library without demonstrating an actual need for it.

---

# 27. Utilities and Composables

Create utilities/composables when logic is:

- Reused
- Complex
- Independent from UI
- Easier to test separately
- Better expressed as a reusable abstraction

Do not create abstractions for one trivial operation.

Avoid utility files becoming miscellaneous dumping grounds.

Each utility should have a clear responsibility.

---

# 28. Naming Conventions

Use descriptive and consistent names.

Names should explain intent.

Prefer:

```js
searchResults;
isLoading;
selectedSeason;
formattedDate;
handleSearch;
fetchMovieDetails;
```

Avoid:

```js
data1;
temp;
thing;
x;
foo;
doStuff;
```

Boolean variables should communicate boolean meaning:

```js
isLoading;
hasResults;
isActive;
canPlay;
```

Functions should generally use action-oriented names:

```js
fetchData();
handleSubmit();
removeItem();
formatRating();
```

---

# 29. File Organization

Keep files logically organized.

Related functionality should remain close together.

Avoid:

- Giant files
- Random utility folders
- Deeply nested unnecessary directories
- Duplicate implementations
- Unclear naming

Follow the existing repository structure unless there is a strong reason to change it.

Do not reorganize unrelated files during a focused task.

---

# 30. Comments

Write comments only when they provide useful context.

Good comments explain:

- Why something is necessary
- Non-obvious browser behavior
- Important performance decisions
- Security considerations
- Workarounds
- Complex algorithms

Do not write comments that merely repeat the code.

Bad:

```js
// Increment count
count++;
```

Good:

```js
// Prevent duplicate requests when users rapidly change the filter.
```

Avoid excessive comments.

---

# 31. Formatting and Linting

All code must follow the repository's configured formatter and linter.

Do not manually fight formatting rules.

Before completing a task:

1. Run the formatter where appropriate.
2. Run ESLint.
3. Fix relevant errors.
4. Re-run validation.

Do not disable lint rules merely to make the linter pass.

If a lint rule genuinely needs an exception, keep the exception as narrow as possible and document why when necessary.

---

# 32. Testing and Verification

Do not assume code works simply because it looks correct.

After meaningful changes, verify:

- Syntax
- Linting
- Build
- Relevant functionality
- Error states
- Edge cases
- Responsive behavior where relevant

Use the project's existing test tooling if available.

Do not create a massive test suite for trivial changes.

Tests should focus on meaningful behavior and regression prevention.

---

# 33. Build Verification

When changes affect:

- Configuration
- Dependencies
- Routing
- Build behavior
- Imports
- Environment handling
- Major components
- Framework modules

run the appropriate build or validation command before declaring the task complete.

Do not claim successful verification without actually performing it.

---

# 34. Git Discipline

Do not modify unrelated files.

Do not rewrite unrelated code while implementing a focused feature.

Do not:

- Delete user work without permission
- Reset branches without explicit instruction
- Force-push without explicit instruction
- Rewrite Git history unnecessarily
- Commit secrets
- Commit generated files when they are intentionally ignored

Keep changes focused and reviewable.

---

# 35. Refactoring Rules

Refactor when it improves:

- Performance
- Correctness
- Maintainability
- Duplication
- Architecture
- Readability

Do not refactor unrelated code merely because it could be written differently.

Avoid large rewrites when a small targeted change is sufficient.

Preserve existing behavior unless the task explicitly requires changing it.

---

# 36. No Premature Abstraction

Do not build infrastructure for hypothetical future requirements.

Avoid:

- Unused generic systems
- Unused configuration layers
- Unused abstractions
- Unused helper functions
- Future-proofing that adds unnecessary complexity

Implement the actual requirement first.

Abstract when repeated patterns or real complexity justify it.

---

# 37. No Overengineering

Prefer the simplest correct solution.

Do not introduce:

- Complex architecture for simple functionality
- Additional services without need
- Extra state layers
- Excessive design patterns
- Unnecessary dependency chains
- Large abstractions
- Configuration for hypothetical use cases

Simple code is preferred when it is equally correct and performant.

---

# 38. API and External Service Boundaries

Treat all external services as unreliable dependencies.

Handle:

- Timeout
- Failure
- Rate limiting
- Missing fields
- Unexpected response formats
- Empty results
- Temporary outages
- Network interruptions

Do not tightly couple the entire UI to a fragile external response structure when a small normalization layer would meaningfully improve reliability.

However, do not create unnecessary abstraction layers solely for theoretical flexibility.

---

# 39. Race Conditions

Asynchronous operations must account for race conditions.

Example scenarios include:

- User changes search query rapidly
- User navigates before a request completes
- Multiple requests update the same state
- User clicks an action repeatedly
- A slower previous request completes after a newer request

Ensure stale operations cannot incorrectly overwrite current state.

---

# 40. Loading States

Every asynchronous user-facing operation should have an appropriate loading state when the delay is noticeable.

Loading states must not cause unnecessary layout shifts.

Prefer:

- Skeletons
- Reserved dimensions
- Stable layouts
- Progressive rendering

Avoid unnecessary spinners for extremely short operations.

---

# 41. Empty States

Empty results are not errors.

Provide appropriate empty states for:

- No results
- No items
- Missing optional content
- Empty search results
- Empty lists

Do not render broken or confusing layouts when collections are empty.

---

# 42. Error UI

Error messages should be:

- Clear
- Concise
- Human-readable
- Actionable where possible

Do not expose:

- Stack traces
- Internal implementation details
- Private URLs
- Secrets
- Debug information

Development diagnostics may remain in development tooling but must not leak into user-facing production UI.

---

# 43. Accessibility and Performance Together

Do not treat accessibility and performance as opposing goals.

Prefer semantic HTML and browser-native functionality because they often improve both accessibility and performance.

Avoid JavaScript solutions when native HTML/CSS can solve the same problem.

---

# 44. Browser APIs

Prefer standard browser APIs when they are sufficient.

Examples include:

- `fetch`
- `URL`
- `URLSearchParams`
- `IntersectionObserver`
- `ResizeObserver`
- `AbortController`
- `requestAnimationFrame`
- Web Storage APIs

Do not install a dependency for functionality that can be implemented cleanly with an existing browser API.

---

# 45. DOM Discipline

Keep the DOM as small as reasonably possible.

Avoid:

- Unnecessary wrapper elements
- Deeply nested markup
- Rendering huge hidden lists
- Duplicated content
- Invisible components that could simply not be rendered

Do not render content merely to hide it with CSS when conditional rendering is more appropriate.

---

# 46. Event Listener Discipline

Do not attach listeners unnecessarily.

When using manual listeners:

- Register them deliberately.
- Remove them when no longer needed.
- Avoid duplicate registration.
- Consider passive listeners where appropriate.
- Avoid expensive work inside high-frequency events.

---

# 47. Memory Management

Avoid unnecessary memory retention.

Be careful with:

- Large arrays
- Cached responses
- Event listeners
- Timers
- Observers
- Object references
- Media resources

Clean up resources when components or features are no longer active.

---

# 48. Accessibility of Dynamic UI

Dynamic content must remain accessible.

When content changes dynamically:

- Preserve logical focus behavior.
- Avoid unexpectedly stealing focus.
- Ensure interactive elements remain keyboard accessible.
- Provide appropriate status feedback when necessary.

---

# 49. Mobile Performance

Assume that some users will have:

- Low-end devices
- Limited memory
- Slow CPUs
- Slow networks
- Mobile browsers

Do not optimize exclusively for a powerful development machine.

Avoid expensive background work.

Avoid unnecessary animations and effects on constrained devices.

---

# 50. Performance Before Visual Complexity

When forced to choose between:

- A visually complex implementation with poor performance
- A clean implementation with excellent performance

choose the performant implementation.

Visual polish must not meaningfully degrade:

- Loading
- Scrolling
- Interaction latency
- Memory usage
- Rendering performance

---

# 51. Data Minimization

Only fetch, store, process, and render the data that is actually needed.

Do not:

- Fetch unnecessary fields
- Store entire API responses when only a few fields are needed
- Render hidden content unnecessarily
- Duplicate large datasets
- Keep stale data indefinitely

---

# 52. Avoid Unnecessary Re-renders

Before adding reactive state, ask:

> Does this value actually need to trigger a UI update?

If not, do not make it reactive.

Before updating shared state, ask:

> Does every consumer actually need this update?

Keep state as local as possible.

---

# 53. Code Quality

Code should be:

- Readable
- Predictable
- Consistent
- Small where possible
- Explicit where necessary
- Easy to debug
- Easy to modify

Avoid clever code that saves a few lines but makes behavior harder to understand.

Prefer maintainability over cleverness.

---

# 54. DRY - With Judgment

Avoid unnecessary duplication.

However, do not abstract two pieces of code merely because they currently look similar.

Only share logic when the shared abstraction has a meaningful common purpose.

Bad abstraction is often worse than small duplication.

---

# 55. YAGNI

Do not implement functionality that has not been requested or justified.

Do not add:

- Unrequested features
- Extra settings
- Unused configuration
- Future integrations
- Extra dependencies
- Unnecessary abstractions

Implement what is required, correctly and completely.

---

# 56. Preserve Existing Behavior

When modifying an existing feature:

1. Understand the current behavior.
2. Identify the requested change.
3. Change only what is necessary.
4. Preserve unrelated behavior.
5. Verify the affected functionality.

Do not silently change unrelated UX or architecture.

---

# 57. Before Editing

Before modifying code:

1. Inspect the relevant files.
2. Understand existing patterns.
3. Check installed dependencies.
4. Check current framework conventions.
5. Identify reusable components/utilities.
6. Determine whether the requested functionality already exists.
7. Consider performance implications.
8. Consider edge cases.

Do not immediately start writing code based only on assumptions.

---

# 58. During Implementation

While coding:

1. Follow existing conventions.
2. Use current package APIs.
3. Reuse existing abstractions.
4. Keep changes focused.
5. Prefer simple solutions.
6. Consider performance continuously.
7. Handle errors and edge cases.
8. Avoid unnecessary dependencies.
9. Avoid unnecessary global state.
10. Keep UI accessible and responsive.

---

# 59. After Implementation

Before declaring the task complete:

1. Review the changed code.
2. Remove unused imports.
3. Remove dead code.
4. Remove unnecessary dependencies.
5. Run formatting.
6. Run ESLint.
7. Run relevant tests.
8. Run a build when appropriate.
9. Check error handling.
10. Check edge cases.
11. Check for accidental unrelated changes.
12. Verify that performance has not been unnecessarily degraded.

---

# 60. Completion Standard

An implementation is not complete merely because the happy path works.

A task is complete when the implementation is:

- Correct
- Current
- Performant
- Smooth
- Responsive
- Accessible
- Secure
- Error-tolerant
- Edge-case-aware
- Properly formatted
- Lint-clean
- Consistent with the installed stack
- Free from unnecessary complexity
- Free from unnecessary dependencies
- Properly verified

---

# 61. Absolute Rules

The following rules must always be followed unless explicitly overridden:

1. **Use JavaScript, never TypeScript.**
2. **Follow the current APIs and conventions of installed package versions.**
3. **Never intentionally use deprecated or legacy APIs when a current alternative exists.**
4. **Do not add dependencies without a concrete reason.**
5. **Prefer existing framework and browser capabilities.**
6. **Prefer reusable components for repeated UI.**
7. **Use centralized design tokens for repeated design values.**
8. **Avoid excessive inline Tailwind class duplication.**
9. **Performance and smoothness are the highest engineering priority.**
10. **Minimize unnecessary network requests.**
11. **Minimize unnecessary JavaScript and DOM work.**
12. **Handle loading, errors, empty states, and realistic edge cases.**
13. **Protect against asynchronous race conditions.**
14. **Never expose secrets or sensitive implementation details.**
15. **Keep state as local and simple as possible.**
16. **Do not overengineer.**
17. **Do not implement unrequested features.**
18. **Do not modify unrelated code.**
19. **Run formatting and linting before completion.**
20. **Verify meaningful changes instead of assuming they work.**
21. **Never claim a command, test, build, or verification was performed if it was not actually performed.**
22. **When uncertain, inspect the existing codebase and installed packages before making assumptions.**
23. **Prefer the simplest solution that is correct, maintainable, and performant.**
24. **Every implementation must be evaluated for performance, accessibility, security, and edge cases.**
25. **Code should be written for the currently installed stack, not for an older version and not for a hypothetical future stack.**
