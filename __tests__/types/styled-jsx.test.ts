import React from 'react'

describe('styled-jsx type definitions', () => {
  describe('StyleHTMLAttributes interface', () => {
    it('should extend React.HTMLAttributes', () => {
      // This test verifies that the type definitions compile correctly
      const styleProps: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: true,
        global: false,
        className: 'test',
        id: 'test-id',
      }

      expect(styleProps).toBeDefined()
      expect(styleProps.jsx).toBe(true)
      expect(styleProps.global).toBe(false)
    })

    it('should allow jsx property as boolean', () => {
      const withJsx: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: true,
      }

      const withoutJsx: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: false,
      }

      expect(withJsx.jsx).toBe(true)
      expect(withoutJsx.jsx).toBe(false)
    })

    it('should allow global property as boolean', () => {
      const globalStyle: React.StyleHTMLAttributes<HTMLStyleElement> = {
        global: true,
      }

      const scopedStyle: React.StyleHTMLAttributes<HTMLStyleElement> = {
        global: false,
      }

      expect(globalStyle.global).toBe(true)
      expect(scopedStyle.global).toBe(false)
    })

    it('should allow optional jsx and global properties', () => {
      const minimalProps: React.StyleHTMLAttributes<HTMLStyleElement> = {}

      expect(minimalProps.jsx).toBeUndefined()
      expect(minimalProps.global).toBeUndefined()
    })

    it('should support all standard HTML style attributes', () => {
      const fullProps: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: true,
        global: true,
        media: 'screen',
        type: 'text/css',
        title: 'custom-styles',
        // Standard React props
        className: 'style-class',
        id: 'style-id',
        'data-testid': 'style-element',
      }

      expect(fullProps).toBeDefined()
      expect(fullProps.media).toBe('screen')
      expect(fullProps.type).toBe('text/css')
      expect(fullProps.title).toBe('custom-styles')
    })
  })

  describe('Type safety', () => {
    it('should enforce boolean type for jsx property', () => {
      // TypeScript compilation test - these should compile without errors
      const validJsx: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: true,
      }

      const validJsxFalse: React.StyleHTMLAttributes<HTMLStyleElement> = {
        jsx: false,
      }

      expect(validJsx.jsx).toBe(true)
      expect(validJsxFalse.jsx).toBe(false)

      // The following would cause TypeScript compilation errors:
      // const invalidJsx: React.StyleHTMLAttributes<HTMLStyleElement> = {
      //   jsx: 'true', // Error: Type 'string' is not assignable to type 'boolean'
      // }
    })

    it('should enforce boolean type for global property', () => {
      // TypeScript compilation test
      const validGlobal: React.StyleHTMLAttributes<HTMLStyleElement> = {
        global: true,
      }

      const validGlobalFalse: React.StyleHTMLAttributes<HTMLStyleElement> = {
        global: false,
      }

      expect(validGlobal.global).toBe(true)
      expect(validGlobalFalse.global).toBe(false)
    })
  })

  describe('Integration with React components', () => {
    it('should work with style elements in JSX', () => {
      const StyleComponent = () => {
        return (
          <style jsx>{`
            .test {
              color: red;
            }
          `}</style>
        )
      }

      expect(StyleComponent).toBeDefined()
    })

    it('should support global styles', () => {
      const GlobalStyleComponent = () => {
        return (
          <style jsx global>{`
            body {
              margin: 0;
              padding: 0;
            }
          `}</style>
        )
      }

      expect(GlobalStyleComponent).toBeDefined()
    })

    it('should support combined jsx and global attributes', () => {
      const CombinedStyleComponent = () => {
        return (
          <>
            <style jsx>{`
              .scoped {
                color: blue;
              }
            `}</style>
            <style jsx global>{`
              .global {
                font-size: 16px;
              }
            `}</style>
          </>
        )
      }

      expect(CombinedStyleComponent).toBeDefined()
    })
  })

  describe('Module augmentation', () => {
    it('should properly augment React module', () => {
      // This test verifies the module augmentation works correctly
      const elem = React.createElement('style', {
        jsx: true,
        global: false,
      })

      expect(elem).toBeDefined()
      expect(elem.type).toBe('style')
    })

    it('should not interfere with other React types', () => {
      // Verify that adding properties to StyleHTMLAttributes doesn't break other types
      const divProps: React.HTMLAttributes<HTMLDivElement> = {
        className: 'test',
        id: 'test-div',
      }

      const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        type: 'text',
        value: 'test',
      }

      expect(divProps).toBeDefined()
      expect(inputProps).toBeDefined()
    })
  })
})