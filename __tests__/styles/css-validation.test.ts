import fs from 'fs'
import path from 'path'

describe('CSS File Validation', () => {
  const readCSSFile = (filePath: string): string => {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8')
  }

  describe('components/counters.module.css', () => {
    let css: string

    beforeAll(() => {
      css = readCSSFile('components/counters.module.css')
    })

    it('should exist and be readable', () => {
      expect(css).toBeDefined()
      expect(css.length).toBeGreaterThan(0)
    })

    it('should contain .counter class', () => {
      expect(css).toMatch(/\.counter\s*{/)
    })

    it('should define button styling properties', () => {
      expect(css).toMatch(/padding:\s*0\.75rem\s+1\.5rem/)
      expect(css).toMatch(/background-color:\s*#2563eb/)
      expect(css).toMatch(/color:\s*white/)
      expect(css).toMatch(/border:\s*none/)
      expect(css).toMatch(/border-radius:\s*0\.375rem/)
    })

    it('should include hover state', () => {
      expect(css).toMatch(/\.counter:hover/)
      expect(css).toMatch(/background-color:\s*#1d4ed8/)
    })

    it('should include active state', () => {
      expect(css).toMatch(/\.counter:active/)
      expect(css).toMatch(/background-color:\s*#1e40af/)
      expect(css).toMatch(/transform:\s*scale\(0\.98\)/)
    })

    it('should include focus state for accessibility', () => {
      expect(css).toMatch(/\.counter:focus/)
      expect(css).toMatch(/outline:\s*none/)
      expect(css).toMatch(/box-shadow/)
    })

    it('should have smooth transitions', () => {
      expect(css).toMatch(/transition/)
    })

    it('should have pointer cursor', () => {
      expect(css).toMatch(/cursor:\s*pointer/)
    })

    it('should not contain syntax errors', () => {
      // Check for unclosed braces
      const openBraces = (css.match(/{/g) || []).length
      const closeBraces = (css.match(/}/g) || []).length
      expect(openBraces).toBe(closeBraces)
    })

    it('should use consistent color scheme', () => {
      // All colors should be blue theme (#2563eb family)
      const colors = css.match(/#[0-9a-f]{6}/gi) || []
      colors.forEach(color => {
        const normalized = color.toLowerCase()
        // Should be in the blue family (#1e40af, #1d4ed8, #2563eb)
        expect(
          normalized === '#1e40af' ||
          normalized === '#1d4ed8' ||
          normalized === '#2563eb'
        ).toBe(true)
      })
    })

    it('should use rem units for scalability', () => {
      expect(css).toMatch(/\d+\.?\d*rem/)
    })
  })

  describe('pages/contact.module.css', () => {
    let css: string

    beforeAll(() => {
      css = readCSSFile('pages/contact.module.css')
    })

    it('should exist and be readable', () => {
      expect(css).toBeDefined()
      expect(css.length).toBeGreaterThan(0)
    })

    it('should contain all required classes', () => {
      const requiredClasses = [
        'contactPage',
        'contactDescription',
        'contactForm',
        'formGroup',
        'required',
        'errorMessage',
        'alert',
        'alertSuccess',
        'alertError',
        'submitButton',
        'charCount',
      ]

      requiredClasses.forEach(className => {
        expect(css).toMatch(new RegExp(`\\.${className}\\s*{`))
      })
    })

    it('should define responsive max-width for contact page', () => {
      expect(css).toMatch(/max-width:\s*600px/)
    })

    it('should have proper form layout', () => {
      expect(css).toMatch(/display:\s*flex/)
      expect(css).toMatch(/flex-direction:\s*column/)
    })

    it('should style input focus states', () => {
      expect(css).toMatch(/\.formGroup\s+input:focus/)
      expect(css).toMatch(/\.formGroup\s+textarea:focus/)
      expect(css).toMatch(/outline:\s*none/)
      expect(css).toMatch(/border-color:\s*#2563eb/)
    })

    it('should style invalid inputs', () => {
      expect(css).toMatch(/\[aria-invalid='true'\]/)
      expect(css).toMatch(/border-color:\s*#dc2626/)
    })

    it('should style disabled inputs', () => {
      expect(css).toMatch(/:disabled/)
      expect(css).toMatch(/cursor:\s*not-allowed/)
    })

    it('should have error message styling', () => {
      expect(css).toMatch(/\.errorMessage/)
      expect(css).toMatch(/color:\s*#dc2626/)
    })

    it('should have success and error alert styles', () => {
      expect(css).toMatch(/\.alertSuccess/)
      expect(css).toMatch(/\.alertError/)
      expect(css).toMatch(/background-color:\s*#d1fae5/) // Success bg
      expect(css).toMatch(/background-color:\s*#fee2e2/) // Error bg
    })

    it('should have submit button states', () => {
      expect(css).toMatch(/\.submitButton/)
      expect(css).toMatch(/\.submitButton:hover:not\(:disabled\)/)
      expect(css).toMatch(/\.submitButton:disabled/)
    })

    it('should include dark mode media query', () => {
      expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/)
    })

    it('should have dark mode styles for inputs', () => {
      const darkModeSection = css.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*{[^}]*}/s)
      expect(darkModeSection).toBeTruthy()
    })

    it('should not contain syntax errors', () => {
      const openBraces = (css.match(/{/g) || []).length
      const closeBraces = (css.match(/}/g) || []).length
      expect(openBraces).toBe(closeBraces)

      // Check for unclosed parentheses
      const openParens = (css.match(/\(/g) || []).length
      const closeParens = (css.match(/\)/g) || []).length
      expect(openParens).toBe(closeParens)
    })

    it('should use consistent spacing units', () => {
      // Should use rem for spacing
      expect(css).toMatch(/padding:\s*[\d.]+rem/)
      expect(css).toMatch(/margin:\s*[\d.]+rem/)
    })

    it('should have accessible color contrast', () => {
      // Error color should be defined
      expect(css).toMatch(/#dc2626/) // Red for errors
      // Success color should be defined
      expect(css).toMatch(/#065f46/) // Green for success text
    })

    it('should have smooth transitions', () => {
      expect(css).toMatch(/transition/)
    })

    it('should use semantic color naming', () => {
      // Primary blue color
      expect(css).toMatch(/#2563eb/)
      // Hover state blue
      expect(css).toMatch(/#1d4ed8/)
    })

    it('should have proper textarea styling', () => {
      expect(css).toMatch(/\.formGroup\s+textarea/)
      expect(css).toMatch(/resize:\s*vertical/)
      expect(css).toMatch(/min-height:\s*120px/)
    })

    it('should have character count styling', () => {
      expect(css).toMatch(/\.charCount/)
      expect(css).toMatch(/text-align:\s*right/)
    })

    it('should have required field indicator', () => {
      expect(css).toMatch(/\.required/)
      expect(css).toMatch(/color:\s*#dc2626/)
    })
  })

  describe('CSS Best Practices', () => {
    it('should use CSS modules naming convention', () => {
      const countersCss = readCSSFile('components/counters.module.css')
      const contactCss = readCSSFile('pages/contact.module.css')

      // Should use camelCase or kebab-case class names
      expect(countersCss).toMatch(/\.[\w-]+\s*{/)
      expect(contactCss).toMatch(/\.[\w-]+\s*{/)
    })

    it('should not have vendor prefixes (handled by PostCSS)', () => {
      const countersCss = readCSSFile('components/counters.module.css')
      const contactCss = readCSSFile('pages/contact.module.css')

      // Should not manually include vendor prefixes
      expect(countersCss).not.toMatch(/-webkit-/)
      expect(countersCss).not.toMatch(/-moz-/)
      expect(contactCss).not.toMatch(/-webkit-/)
      expect(contactCss).not.toMatch(/-moz-/)
    })

    it('should use modern CSS properties', () => {
      const contactCss = readCSSFile('pages/contact.module.css')

      // Should use flexbox
      expect(contactCss).toMatch(/display:\s*flex/)
      // Should use modern color functions or hex
      expect(contactCss).toMatch(/#[0-9a-f]{6}/)
    })

    it('should have consistent formatting', () => {
      const countersCss = readCSSFile('components/counters.module.css')
      const contactCss = readCSSFile('pages/contact.module.css')

      // Should have spaces after colons
      expect(countersCss).toMatch(/:\s+/)
      expect(contactCss).toMatch(/:\s+/)
    })
  })

  describe('Accessibility Compliance', () => {
    it('should have focus indicators', () => {
      const countersCss = readCSSFile('components/counters.module.css')
      const contactCss = readCSSFile('pages/contact.module.css')

      expect(countersCss).toMatch(/:focus/)
      expect(contactCss).toMatch(/:focus/)
    })

    it('should not remove outline without replacement', () => {
      const contactCss = readCSSFile('pages/contact.module.css')

      // If outline is removed, should have box-shadow or border replacement
      const focusRules = contactCss.match(/:focus\s*{[^}]*}/gs) || []
      focusRules.forEach(rule => {
        if (rule.includes('outline: none')) {
          expect(rule).toMatch(/box-shadow|border/)
        }
      })
    })

    it('should use aria-invalid attribute selectors', () => {
      const contactCss = readCSSFile('pages/contact.module.css')

      expect(contactCss).toMatch(/\[aria-invalid/)
    })

    it('should have adequate color contrast', () => {
      const contactCss = readCSSFile('pages/contact.module.css')

      // Should define text colors that contrast with backgrounds
      expect(contactCss).toMatch(/color:\s*white/) // On dark blue background
      expect(contactCss).toMatch(/color:\s*#dc2626/) // Red text
      expect(contactCss).toMatch(/color:\s*#065f46/) // Green text
    })
  })
})