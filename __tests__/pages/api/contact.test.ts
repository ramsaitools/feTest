import { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../pages/api/contact'

// Mock response object
const createMockResponse = () => {
  const res = {} as NextApiResponse
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

// Mock request object
const createMockRequest = (method: string, body: any = {}): NextApiRequest => {
  return {
    method,
    body,
  } as NextApiRequest
}

describe('/api/contact', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405 status', async () => {
      const req = createMockRequest('GET')
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Method not allowed',
      })
    })

    it('should reject PUT requests with 405 status', async () => {
      const req = createMockRequest('PUT')
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Method not allowed',
      })
    })

    it('should reject DELETE requests with 405 status', async () => {
      const req = createMockRequest('DELETE')
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Method not allowed',
      })
    })

    it('should accept POST requests', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Name Validation', () => {
    it('should reject empty name', async () => {
      const req = createMockRequest('POST', {
        name: '',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: 'Name is required',
        }),
      })
    })

    it('should reject whitespace-only name', async () => {
      const req = createMockRequest('POST', {
        name: '   ',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: 'Name is required',
        }),
      })
    })

    it('should reject name with less than 2 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'A',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: 'Name must be at least 2 characters',
        }),
      })
    })

    it('should reject name with more than 100 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'A'.repeat(101),
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: 'Name must be less than 100 characters',
        }),
      })
    })

    it('should accept valid name with 2 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'Jo',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should accept valid name with 100 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'A'.repeat(100),
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should accept name with spaces', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe Smith',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should trim whitespace from name', async () => {
      const req = createMockRequest('POST', {
        name: '  John Doe  ',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Email Validation', () => {
    it('should reject empty email', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: '',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          email: 'Email is required',
        }),
      })
    })

    it('should reject invalid email format', async () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'no@domain@double.com',
        'spaces in@email.com',
        'missing.domain@',
        '.startwithdot@email.com',
        'endswithdot.@email.com',
      ]

      for (const email of invalidEmails) {
        const req = createMockRequest('POST', {
          name: 'John Doe',
          email,
          message: 'Valid message here that is long enough',
        })
        const res = createMockResponse()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Validation failed',
          errors: expect.objectContaining({
            email: 'Please enter a valid email address',
          }),
        })
      }
    })

    it('should reject email longer than 254 characters', async () => {
      const longEmail = 'a'.repeat(250) + '@test.com'
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: longEmail,
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          email: 'Email is too long',
        }),
      })
    })

    it('should accept valid email addresses', async () => {
      const validEmails = [
        'test@example.com',
        'user+tag@example.com',
        'first.last@example.com',
        'user123@test-domain.com',
        'a@b.co',
        'test_user@example.org',
        'user%test@example.com',
      ]

      for (const email of validEmails) {
        const req = createMockRequest('POST', {
          name: 'John Doe',
          email,
          message: 'Valid message here that is long enough',
        })
        const res = createMockResponse()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
      }
    })

    it('should convert email to lowercase', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'Test@EXAMPLE.COM',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Contact form submission received:',
        expect.objectContaining({
          emailDomain: 'example.com',
        })
      )
    })
  })

  describe('Message Validation', () => {
    it('should reject empty message', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: '',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          message: 'Message is required',
        }),
      })
    })

    it('should reject message with less than 10 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Short',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          message: 'Message must be at least 10 characters',
        }),
      })
    })

    it('should reject message with more than 5000 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'A'.repeat(5001),
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          message: 'Message must be less than 5000 characters',
        }),
      })
    })

    it('should accept message with exactly 10 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: '1234567890',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should accept message with exactly 5000 characters', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'A'.repeat(5000),
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('XSS and Injection Prevention', () => {
    it('should sanitize HTML tags from name', async () => {
      const req = createMockRequest('POST', {
        name: 'John <script>alert("xss")</script> Doe',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should sanitize HTML tags from email', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test<tag>@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400) // Should fail validation after sanitization
    })

    it('should sanitize HTML tags from message', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: '<script>alert("xss")</script> This is a valid message that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should handle SQL injection attempts in message', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: "'; DROP TABLE users; -- This is long enough for validation",
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Multiple Field Validation', () => {
    it('should return errors for all invalid fields', async () => {
      const req = createMockRequest('POST', {
        name: '',
        email: 'invalid-email',
        message: 'short',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: {
          name: 'Name is required',
          email: 'Please enter a valid email address',
          message: 'Message must be at least 10 characters',
        },
      })
    })

    it('should validate all fields even when first field fails', async () => {
      const req = createMockRequest('POST', {
        name: 'A',
        email: '',
        message: '',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
          message: expect.any(String),
        }),
      })
    })
  })

  describe('Successful Submission', () => {
    it('should accept valid form data', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid test message that meets all requirements',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      })
    })

    it('should log submission without exposing sensitive data', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid test message',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Contact form submission received:',
        expect.objectContaining({
          timestamp: expect.any(String),
          nameLength: expect.any(Number),
          emailDomain: 'example.com',
        })
      )
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('john@example.com')
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle missing request body gracefully', async () => {
      const req = createMockRequest('POST', undefined)
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should handle null values in request body', async () => {
      const req = createMockRequest('POST', {
        name: null,
        email: null,
        message: null,
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.objectContaining({
          name: 'Name is required',
          email: 'Email is required',
          message: 'Message is required',
        }),
      })
    })

    it('should handle undefined values in request body', async () => {
      const req = createMockRequest('POST', {
        name: undefined,
        email: undefined,
        message: undefined,
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return 500 and generic message on unexpected errors', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Valid message',
      })
      const res = createMockResponse()

      // Force an error by making json throw
      res.json = jest.fn(() => {
        throw new Error('Unexpected error')
      })

      await handler(req, res)

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('Edge Cases', () => {
    it('should handle unicode characters in name', async () => {
      const req = createMockRequest('POST', {
        name: 'José García',
        email: 'test@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should handle emoji in message', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Hello! 👋 This is a test message with emojis 🎉',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should handle special characters in email local part', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test+filter@example.com',
        message: 'Valid message here that is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should handle line breaks in message', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Line 1\nLine 2\nLine 3\nThis is long enough',
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})