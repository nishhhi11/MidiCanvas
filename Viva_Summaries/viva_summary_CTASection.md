# FILE SUMMARY: src/components/landing/CTASection.jsx

## Purpose
The final call-to-action block on the landing page, doubling as a massive file dropzone to instantly start the app experience.

## React Concepts Used
- `useCallback` for referential equality optimization.
- `useNavigate` for programmatic routing after an async action.

## Most Likely Viva Questions
1. Explain the difference between `useCallback` and `useMemo`.

## Expected Answers
1. Both hooks cache values between renders to improve performance. However, `useMemo` executes a function and caches its *result* (like an array or object), whereas `useCallback` caches the *function definition itself*. `useCallback(fn, deps)` is effectively syntactic sugar for `useMemo(() => fn, deps)`.
