# Frontend Security Implementation Task List

Based on [frontendplan.md](frontendplan.md)

---

## Week 1: Foundation

### 1. Git Hooks Setup

- [ ] **1.1** Install Husky for git hooks management
  ```bash
  npm install -D husky
  npx husky init
  ```

- [ ] **1.2** Install lint-staged for staged file linting
  ```bash
  npm install -D lint-staged
  ```
  - Add lint-staged configuration to `package.json`

- [ ] **1.3** Install Gitleaks (secrets detection)
  - Download from [Gitleaks releases](https://github.com/gitleaks/gitleaks/releases)
  - Create `.gitleaks.toml` configuration file

### 2. ESLint Security Configuration

- [ ] **2.1** Install ESLint security plugins
  ```bash
  npm install -D eslint-plugin-security eslint-plugin-no-secrets @next/eslint-plugin-next
  ```

- [ ] **2.2** Create/update `.eslintrc.js` with security rules
  - Enable `security/detect-object-injection`
  - Enable `security/detect-non-literal-regexp`
  - Enable `security/detect-unsafe-regex`
  - Enable `security/detect-buffer-noassert`
  - Enable `security/detect-eval-with-expression`
  - Enable `security/detect-no-csrf-before-method-override`
  - Enable `security/detect-possible-timing-attacks`

### 3. Code Formatting

- [ ] **3.1** Install Prettier (if not already installed)
  ```bash
  npm install -D prettier
  ```

- [ ] **3.2** Create `.prettierrc` configuration file

### 4. Pre-commit Hook

- [ ] **4.1** Create `.husky/pre-commit` hook
  - Gitleaks secrets scan (blocking)
  - ESLint linting (blocking)
  - Prettier formatting (blocking)
  - TypeScript type check (blocking)

### 5. Pre-push Hook

- [ ] **5.1** Create `.husky/pre-push` hook
  - Unit tests with Jest/Vitest (blocking)
  - Semgrep SAST scan (blocking on Critical/High)
  - Next.js build (blocking)

### 6. GitHub Dependabot

- [ ] **6.1** Create `.github/dependabot.yml`
  - Configure npm ecosystem
  - Weekly updates schedule
  - Immediate security updates
  - Group minor/patch updates

### 7. GitHub Actions - Security Workflow

- [ ] **7.1** Create `.github/workflows/security.yml`
  - **Job: secrets-scan** - Gitleaks action
  - **Job: sast-scan** - Semgrep with `p/nextjs`, `p/react`, `p/typescript`
  - **Job: sca-scan** - Trivy filesystem scan + `npm audit`
  - **Job: security-gate** - Aggregate results, fail on Critical/High

---

## Week 2: Enhancement

### 8. GitHub Actions - CI Workflow

- [ ] **8.1** Create `.github/workflows/ci.yml`
  - **Job: lint** - ESLint
  - **Job: type-check** - TypeScript compiler
  - **Job: test** - Jest/Vitest with coverage
  - **Job: build** - Next.js build
  - **Job: lighthouse** - Performance/accessibility audit (non-blocking)

### 9. Next.js Security Headers

- [ ] **9.1** Update `next.config.js` with security headers
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy`
  - `Strict-Transport-Security`

### 10. PR Template

- [ ] **10.1** Create `.github/PULL_REQUEST_TEMPLATE.md`
  - Summary section
  - Type of change checkboxes
  - Security checklist
  - Testing checklist

### 11. Environment Variables

- [ ] **11.1** Create `.env.example` template file
  - Document all required environment variables
  - Mark which are `NEXT_PUBLIC_*` (client-exposed)
  - Mark which are server-only secrets

- [ ] **11.2** Verify `.env.local` is in `.gitignore`

---

## Week 3: Optimization

### 12. IDE Configuration

- [ ] **12.1** Create `.vscode/settings.json`
  - Enable format on save
  - Enable ESLint auto-fix on save
  - Configure recommended extensions

- [ ] **12.2** Create `.vscode/extensions.json`
  - ESLint
  - Prettier
  - SonarLint
  - Semgrep
  - GitLens
  - Error Lens

### 13. Optional Enhancements

- [ ] **13.1** Configure SonarQube/SonarCloud integration (optional)

- [ ] **13.2** Enable Socket.dev free tier for supply chain security (optional)

- [ ] **13.3** Add Lighthouse CI to GitHub Actions (optional)

- [ ] **13.4** Create custom Semgrep rules for project-specific patterns (optional)

---

## Verification & Testing

### 14. Verification Tasks

- [ ] **14.1** Test pre-commit hook
  - Intentionally add a secret and verify Gitleaks catches it
  - Introduce a linting error and verify ESLint catches it

- [ ] **14.2** Test pre-push hook
  - Verify tests run before push
  - Verify build completes

- [ ] **14.3** Test GitHub Actions workflows
  - Create a test PR and verify all jobs run
  - Verify security gates block on Critical/High findings

- [ ] **14.4** Verify security headers
  - Use browser dev tools or [securityheaders.com](https://securityheaders.com)
  - Confirm all headers are present in production build

- [ ] **14.5** Run full security audit
  - `npm audit`
  - Semgrep scan
  - Gitleaks scan
  - Trivy scan

---

## Files to Create Summary

| File | Task Reference |
|------|----------------|
| `.gitleaks.toml` | 1.3 |
| `.eslintrc.js` | 2.2 |
| `.prettierrc` | 3.2 |
| `.husky/pre-commit` | 4.1 |
| `.husky/pre-push` | 5.1 |
| `.github/dependabot.yml` | 6.1 |
| `.github/workflows/security.yml` | 7.1 |
| `.github/workflows/ci.yml` | 8.1 |
| `next.config.js` (update) | 9.1 |
| `.github/PULL_REQUEST_TEMPLATE.md` | 10.1 |
| `.env.example` | 11.1 |
| `.vscode/settings.json` | 12.1 |
| `.vscode/extensions.json` | 12.2 |

---

## Success Criteria

| Metric | Target | Verified |
|--------|--------|----------|
| Secrets leaked | 0 | [ ] |
| Critical/High vulns in prod | 0 | [ ] |
| Pre-commit hook adoption | 100% of devs | [ ] |
| PR security checklist completion | 100% | [ ] |
| Dependency vulnerabilities | 0 Critical, <5 High | [ ] |
| Lighthouse security score | >90 | [ ] |

---

## Notes

- All security tools listed are free/open source
- Priority 1 (P1) tools should be implemented in Weeks 1-2
- Priority 2 (P2) tools are optional enhancements for Week 3
- Refer to [frontendplan.md](frontendplan.md) for detailed configurations and rationale
