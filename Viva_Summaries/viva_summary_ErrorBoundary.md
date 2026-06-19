# FILE SUMMARY: src/components/common/ErrorBoundary.jsx

## Purpose
A protective wrapper that prevents the entire web application from going blank if a sub-component throws an unexpected error.

## Data Flow
Child Component Throws Error -> React bubbles error up to `ErrorBoundary` -> `getDerivedStateFromError` catches it -> `state.hasError` becomes true -> Renders Fallback UI instead of children.

## React Concepts Used
- Class Components.
- Lifecycle Methods (`getDerivedStateFromError`, `componentDidCatch`).
- `this.props.children` to render nested components.

## Most Likely Viva Questions
1. What kind of errors does an Error Boundary catch?

## Expected Answers
1. It catches errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. However, it does *not* catch errors inside event handlers (like a button click), asynchronous code (like `setTimeout`), server-side rendering, or errors thrown in the ErrorBoundary itself.
