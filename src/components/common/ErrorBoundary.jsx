import React from 'react';

/*
PURPOSE:
Catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of crashing the whole React application.

REACT CONCEPT:
Error Boundaries (Must be built using Class Components in React).

VIVA QUESTION:
Why is this component written as a Class Component instead of a Functional Component with Hooks?

VIVA ANSWER:
As of React 18, there is no Hook equivalent to `getDerivedStateFromError` or `componentDidCatch`. Error Boundaries are the one specific feature in modern React that strictly requires Class Components.
*/
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /*
  PURPOSE:
  Called during the "render" phase. It updates state so the next render will show the fallback UI.
  */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /*
  PURPOSE:
  Called during the "commit" phase. Used for logging the error to an external service or the console.
  */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/50 rounded-xl m-4 text-center">
          <h2 className="text-lg font-bold text-red-400 mb-2">Something went wrong</h2>
          <p className="text-xs text-red-300 mb-4">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded font-bold transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    // If no error, render the normal application tree
    return this.props.children; 
  }
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A protective wrapper that prevents the entire web application from going blank if a sub-component throws an unexpected error.

Data Flow:
Child Component Throws Error -> React bubbles error up to `ErrorBoundary` -> `getDerivedStateFromError` catches it -> `state.hasError` becomes true -> Renders Fallback UI instead of children.

React Concepts Used:
- Class Components.
- Lifecycle Methods (`getDerivedStateFromError`, `componentDidCatch`).
- `this.props.children` to render nested components.

Most Likely Viva Questions:
1. What kind of errors does an Error Boundary catch?

Expected Answers:
1. It catches errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. However, it does *not* catch errors inside event handlers (like a button click), asynchronous code (like `setTimeout`), server-side rendering, or errors thrown in the ErrorBoundary itself.
*/
