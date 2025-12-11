# Testing Quick Start Guide

## Installation

```bash
pnpm install
```

This will install all testing dependencies including:
- jest
- @testing-library/react
- @testing-library/user-event
- @testing-library/jest-dom
- jest-environment-jsdom

## Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (auto-rerun on file changes)
npm run test:watch
```

## What Was Tested

### ✅ pages/api/contact.ts (60+ tests)
- HTTP method validation
- Input validation (name, email, message)
- XSS and SQL injection prevention
- Error handling
- Edge cases

### ✅ pages/contact.tsx (45+ tests)
- Component rendering
- User interactions
- Form validation
- Submission handling
- Accessibility

### ✅ types/styled-jsx.d.ts (15+ tests)
- Type definitions
- Interface extensions
- React integration

### ✅ CSS Files (40+ tests)
- Syntax validation
- Required classes
- Accessibility compliance
- Dark mode support

## Expected Output

When you run `npm test`, you should see: