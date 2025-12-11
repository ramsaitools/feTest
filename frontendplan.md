# Frontend Security Testing Plan - Next.js Application

## Overview

This document outlines the security testing plan for the sample Next.js frontend application, implementing the tools and practices from the AI-Driven SDLC Security Automation Playbook v5.0.0.

---

## 1. Repository Setup

### 1.1 Pre-commit Hooks

Install and configure pre-commit hooks for local security scanning.

**Tools:**
| Tool | Purpose | Config File |
|------|---------|-------------|
| Gitleaks | Secrets detection | `.gitleaks.toml` |
| ESLint | JS/TS linting + security rules | `.eslintrc.js` |
| Prettier | Code formatting | `.prettierrc` |
| Husky | Git hooks manager | `.husky/` |
| lint-staged | Run linters on staged files | `package.json` |

**Required npm packages:**
```
husky
lint-staged
gitleaks (install separately)
eslint
eslint-plugin-security
eslint-plugin-react-hooks
prettier
```

### 1.2 ESLint Security Configuration

Add security-focused ESLint rules:

**Plugins to install:**
- `eslint-plugin-security` - General security rules
- `eslint-plugin-no-secrets` - Detect hardcoded secrets
- `@next/eslint-plugin-next` - Next.js specific rules

**Key rules to enable:**
- `security/detect-object-injection`
- `security/detect-non-literal-regexp`
- `security/detect-unsafe-regex`
- `security/detect-buffer-noassert`
- `security/detect-eval-with-expression`
- `security/detect-no-csrf-before-method-override`
- `security/detect-possible-timing-attacks`

---

## 2. Phase A - Local Development Security

### 2.1 IDE Setup (VS Code)

**Required Extensions:**
| Extension | Purpose |
|-----------|---------|
| ESLint | Real-time linting |
| Prettier | Auto-formatting |
| SonarLint | SAST + code quality |
| Semgrep | Lightweight SAST |
| GitLens | Git blame/history |
| Error Lens | Inline error display |

**Workspace settings (.vscode/settings.json):**
- Enable format on save
- Enable ESLint auto-fix on save
- Configure SonarLint connection (optional)

### 2.2 Pre-commit Checks

| Check | Tool | Blocking |
|-------|------|----------|
| Secrets scan | Gitleaks | Yes |
| Linting | ESLint | Yes |
| Formatting | Prettier | Yes |
| Type check | TypeScript | Yes |

### 2.3 Pre-push Checks

| Check | Tool | Blocking |
|-------|------|----------|
| Unit tests | Jest/Vitest | Yes |
| SAST scan | Semgrep | Yes (Critical/High) |
| Build | Next.js | Yes |

---

## 3. Phase B - Pre-PR Validation

### 3.1 Pre-PR Checklist

Before opening a PR, verify:

**Code Quality:**
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes (if using TypeScript)
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] No console.log statements in production code

**Security:**
- [ ] Gitleaks scan clean
- [ ] Semgrep scan: no Critical/High findings
- [ ] No hardcoded API keys, tokens, or secrets
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] All user inputs validated/sanitized
- [ ] Dependencies reviewed (`npm audit`)

**Next.js Specific:**
- [ ] No sensitive data in client components
- [ ] API routes have proper authentication
- [ ] Environment variables use `NEXT_PUBLIC_` prefix correctly
- [ ] No secrets in `NEXT_PUBLIC_*` variables

### 3.2 PR Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Styling/UI change

## Security Checklist
- [ ] No hardcoded secrets or API keys
- [ ] User inputs are validated/sanitized
- [ ] No use of dangerouslySetInnerHTML (or properly sanitized)
- [ ] API routes have proper auth checks
- [ ] Dependencies scanned with npm audit
- [ ] Sensitive data not exposed to client

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested in multiple browsers (if UI change)
```

---

## 4. Phase C - CI/CD Pipeline Security

### 4.1 GitHub Actions Jobs

| Job | Tool | Trigger | Blocking |
|-----|------|---------|----------|
| secrets-scan | Gitleaks | PR, Push | Yes |
| lint | ESLint | PR, Push | Yes |
| type-check | TypeScript | PR, Push | Yes |
| unit-tests | Jest/Vitest | PR, Push | Yes |
| sast-scan | Semgrep | PR | Yes (Critical/High) |
| sca-scan | Trivy + npm audit | PR | Yes (Critical) |
| build | Next.js | PR, Push | Yes |
| lighthouse | Lighthouse CI | PR | No (report only) |

### 4.2 GitHub Actions Workflow Structure

**Workflow: `.github/workflows/security.yml`**

Jobs to implement:
1. **secrets-scan** - Gitleaks action
2. **sast-scan** - Semgrep action with `p/nextjs`, `p/react`, `p/typescript`
3. **sca-scan** - Trivy filesystem scan + `npm audit`
4. **security-gate** - Aggregate results, fail on Critical/High

**Workflow: `.github/workflows/ci.yml`**

Jobs to implement:
1. **lint** - ESLint
2. **type-check** - TypeScript compiler
3. **test** - Jest/Vitest with coverage
4. **build** - Next.js build
5. **lighthouse** - Performance/accessibility audit

### 4.3 Semgrep Rules for Next.js

**Recommended rulesets:**
- `p/nextjs` - Next.js specific security rules
- `p/react` - React security rules
- `p/typescript` - TypeScript rules
- `p/security-audit` - General security audit
- `p/owasp-top-ten` - OWASP Top 10

**Key vulnerabilities to detect:**
- XSS via `dangerouslySetInnerHTML`
- SSRF in API routes
- Open redirects
- Insecure cookies
- Missing CSRF protection
- Exposed sensitive data in client bundles

---

## 5. Dependency Security (SCA)

### 5.1 npm Audit

Run regularly:
- `npm audit` - Check for vulnerabilities
- `npm audit fix` - Auto-fix where possible
- `npm audit --audit-level=high` - Fail on high+ severity

### 5.2 Dependabot Configuration

**File: `.github/dependabot.yml`**

Configure for:
- `npm` ecosystem
- Weekly updates
- Security updates (immediate)
- Group minor/patch updates

### 5.3 Trivy Filesystem Scan

Scan `package-lock.json` and `node_modules` for:
- Known CVEs in dependencies
- License compliance issues
- Outdated packages with vulnerabilities

### 5.4 Socket.dev (Optional)

Enable for:
- Malicious package detection
- Typosquatting detection
- Supply chain attack prevention

---

## 6. Next.js Specific Security Checks

### 6.1 Security Headers

Verify these headers are configured in `next.config.js`:

| Header | Purpose |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Prevent MIME sniffing |
| `X-Frame-Options: DENY` | Prevent clickjacking |
| `X-XSS-Protection: 1; mode=block` | XSS filter |
| `Referrer-Policy: strict-origin-when-cross-origin` | Control referrer |
| `Content-Security-Policy` | Prevent XSS, injection |
| `Strict-Transport-Security` | Force HTTPS |

### 6.2 Environment Variables

**Audit checklist:**
- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] Server-only secrets not exposed to client
- [ ] `.env.local` in `.gitignore`
- [ ] Production env vars in secure storage (not repo)

### 6.3 API Routes Security

**Checklist for each API route:**
- [ ] Authentication check (if required)
- [ ] Authorization check (if required)
- [ ] Input validation
- [ ] Rate limiting consideration
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured correctly

### 6.4 Client-Side Security

**Checklist:**
- [ ] No sensitive data in React state/props
- [ ] No secrets in client bundle
- [ ] User input sanitized before display
- [ ] Links with `target="_blank"` have `rel="noopener noreferrer"`
- [ ] No `eval()` or `new Function()` with user input

---

## 7. Testing Tools Summary

### 7.1 Security Tools

| Tool | Category | Cost | Priority |
|------|----------|------|----------|
| Gitleaks | Secrets | $0 | P1 |
| Semgrep | SAST | $0 | P1 |
| Trivy | SCA | $0 | P1 |
| npm audit | SCA | $0 | P1 |
| ESLint + security plugins | SAST | $0 | P1 |
| Dependabot | SCA | $0 | P1 |
| Socket.dev | Supply Chain | $0 (free tier) | P2 |

### 7.2 Quality Tools

| Tool | Category | Cost | Priority |
|------|----------|------|----------|
| ESLint | Linting | $0 | P1 |
| Prettier | Formatting | $0 | P1 |
| TypeScript | Type checking | $0 | P1 |
| Jest/Vitest | Unit testing | $0 | P1 |
| Playwright/Cypress | E2E testing | $0 | P2 |
| Lighthouse | Performance | $0 | P2 |
| SonarQube | Code quality | $0 | P2 |

---

## 8. Implementation Checklist

### Week 1: Foundation
- [ ] Install Husky + lint-staged
- [ ] Configure ESLint with security plugins
- [ ] Add Gitleaks pre-commit hook
- [ ] Enable Dependabot
- [ ] Create GitHub Actions security workflow

### Week 2: Enhancement
- [ ] Add Semgrep to CI pipeline
- [ ] Add Trivy scanning
- [ ] Configure security headers in Next.js
- [ ] Create PR template with security checklist
- [ ] Document environment variable policy

### Week 3: Optimization
- [ ] Add SonarQube (optional)
- [ ] Configure Socket.dev free tier
- [ ] Add Lighthouse CI
- [ ] Create custom Semgrep rules (if needed)
- [ ] Security training for team

---

## 9. Files to Create

| File | Purpose |
|------|---------|
| `.gitleaks.toml` | Gitleaks configuration |
| `.eslintrc.js` | ESLint config with security rules |
| `.prettierrc` | Prettier configuration |
| `.husky/pre-commit` | Pre-commit hook |
| `.husky/pre-push` | Pre-push hook |
| `.github/workflows/security.yml` | Security scanning workflow |
| `.github/workflows/ci.yml` | CI workflow |
| `.github/dependabot.yml` | Dependabot configuration |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR template |
| `next.config.js` | Security headers |
| `.env.example` | Environment variable template |

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Secrets leaked | 0 |
| Critical/High vulns in prod | 0 |
| Pre-commit hook adoption | 100% of devs |
| PR security checklist completion | 100% |
| Dependency vulnerabilities | 0 Critical, <5 High |
| Lighthouse security score | >90 |

---

## References

- [Next.js Security Documentation](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Cheat Sheet - React](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)
- [Semgrep Next.js Rules](https://semgrep.dev/p/nextjs)
- [AI-Driven SDLC Security Automation Playbook v5.0.0](./ai-sdlc-automation-v5.0.0.docx)


Recommended: Add a Contact Form with API Route
This is ideal because it covers multiple security and code quality aspects CodeRabbit can analyze: What to implement:
A /contact page with a form (name, email, message)
An API route /api/contact to handle submissions
Input validation (client + server side)
Error handling
Why it's good for CodeRabbit testing:
Security checks: Input sanitization, XSS prevention, rate limiting concerns
API route patterns: Authentication, validation, error handling
React best practices: Form handling, state management, accessibility
TypeScript: Type safety, interface definitions