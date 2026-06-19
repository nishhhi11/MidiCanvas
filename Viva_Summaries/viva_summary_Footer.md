# FILE SUMMARY: src/components/common/Footer.jsx

## Purpose
A simple UI component that displays the application footer.

## React Concepts Used
- `react-router-dom`'s `<Link>` component for SPA navigation.

## Most Likely Viva Questions
1. What does `rel="noreferrer"` do on the external link?

## Expected Answers
1. It is a security and privacy measure. When opening an external site in a new tab (`target="_blank"`), `noreferrer` prevents the new page from knowing where the user came from (hides the Referer header). In older browsers, it also implicitly acted as `noopener`, preventing the external page from accessing the `window.opener` object to maliciously manipulate our app's original tab.
