import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactPage from '../../pages/contact'

// Mock fetch
global.fetch = jest.fn()

describe('ContactPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('Rendering', () => {
    it('should render the contact form', () => {
      render(<ContactPage />)
      
      expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument()
      expect(screen.getByText(/have a question or feedback/i)).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      render(<ContactPage />)
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    })

    it('should render required indicators', () => {
      render(<ContactPage />)
      
      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators).toHaveLength(3)
    })

    it('should render submit button', () => {
      render(<ContactPage />)
      
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })

    it('should render character counter for message', () => {
      render(<ContactPage />)
      
      expect(screen.getByText('0/5000 characters')).toBeInTheDocument()
    })

    it('should have proper ARIA attributes on inputs', () => {
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      
      expect(nameInput).toHaveAttribute('aria-invalid', 'false')
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')
      expect(messageInput).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Form Input Handling', () => {
    it('should update name field on input', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'John Doe')
      
      expect(nameInput).toHaveValue('John Doe')
    })

    it('should update email field on input', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'john@example.com')
      
      expect(emailInput).toHaveValue('john@example.com')
    })

    it('should update message field on input', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const messageInput = screen.getByLabelText(/message/i)
      await user.type(messageInput, 'This is my message')
      
      expect(messageInput).toHaveValue('This is my message')
    })

    it('should update character counter as user types', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const messageInput = screen.getByLabelText(/message/i)
      await user.type(messageInput, 'Hello World')
      
      expect(screen.getByText('11/5000 characters')).toBeInTheDocument()
    })
  })

  describe('Name Field Validation', () => {
    it('should show error for empty name on blur', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for name with less than 2 characters', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'A')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('should show error for name with more than 100 characters', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'A'.repeat(101))
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/name must be less than 100 characters/i)).toBeInTheDocument()
      })
    })

    it('should clear name error when valid input is provided', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'A')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      })
      
      await user.clear(nameInput)
      await user.type(nameInput, 'John Doe')
      
      await waitFor(() => {
        expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument()
      })
    })

    it('should set aria-invalid to true when name has error', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('Email Field Validation', () => {
    it('should show error for empty email on blur', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.click(emailInput)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'notanemail')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should show error for email longer than 254 characters', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const longEmail = 'a'.repeat(250) + '@test.com'
      await user.type(emailInput, longEmail)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/email is too long/i)).toBeInTheDocument()
      })
    })

    it('should accept valid email formats', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Message Field Validation', () => {
    it('should show error for empty message on blur', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const messageInput = screen.getByLabelText(/message/i)
      await user.click(messageInput)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for message with less than 10 characters', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const messageInput = screen.getByLabelText(/message/i)
      await user.type(messageInput, 'Short')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
    })

    it('should show error for message with more than 5000 characters', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const messageInput = screen.getByLabelText(/message/i)
      await user.type(messageInput, 'A'.repeat(5001))
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/message must be less than 5000 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      })
      
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you for your message',
        }),
      })
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'This is a valid test message',
          }),
        })
      })
    })

    it('should show success message on successful submission', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you for your message. We will get back to you soon!',
        }),
      })
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/thank you for your message/i)
      })
    })

    it('should clear form on successful submission', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you for your message',
        }),
      })
      
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(nameInput).toHaveValue('')
        expect(emailInput).toHaveValue('')
        expect(messageInput).toHaveValue('')
      })
    })

    it('should show error message on submission failure', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Validation failed',
          errors: {
            email: 'Invalid email',
          },
        }),
      })
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'invalid')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/validation failed/i)
      })
    })

    it('should show server validation errors', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Validation failed',
          errors: {
            name: 'Name is too short',
            email: 'Invalid email format',
          },
        }),
      })
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'Jo')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/name is too short/i)).toBeInTheDocument()
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/failed to send message/i)
      })
    })

    it('should disable form during submission', async () => {
      const user = userEvent.setup()
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      ;(global.fetch as jest.Mock).mockReturnValueOnce(promise)
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
        expect(screen.getByLabelText(/name/i)).toBeDisabled()
        expect(screen.getByLabelText(/email/i)).toBeDisabled()
        expect(screen.getByLabelText(/message/i)).toBeDisabled()
      })
      
      resolvePromise!({
        json: async () => ({ success: true, message: 'Success' }),
      })
    })

    it('should show "Sending..." text on submit button during submission', async () => {
      const user = userEvent.setup()
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      ;(global.fetch as jest.Mock).mockReturnValueOnce(promise)
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
      })
      
      resolvePromise!({
        json: async () => ({ success: true, message: 'Success' }),
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<ContactPage />)
      
      const form = screen.getByRole('form', { hidden: true })
      expect(form).toBeInTheDocument()
    })

    it('should associate labels with inputs', () => {
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      
      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(messageInput).toHaveAttribute('id', 'message')
    })

    it('should have aria-describedby for error messages', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')
        expect(screen.getByText(/name is required/i)).toHaveAttribute('id', 'name-error')
      })
    })

    it('should have role="alert" on error messages', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/name is required/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid input changes', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'A')
      await user.type(nameInput, 'B')
      await user.type(nameInput, 'C')
      
      expect(nameInput).toHaveValue('ABC')
    })

    it('should preserve input when switching between fields', async () => {
      const user = userEvent.setup()
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Test message')
      
      expect(screen.getByLabelText(/name/i)).toHaveValue('John')
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com')
      expect(screen.getByLabelText(/message/i)).toHaveValue('Test message')
    })

    it('should handle form reset after failed submission', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Server error',
        }),
      })
      
      render(<ContactPage />)
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid test message')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      
      // Values should be preserved after failed submission
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe')
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com')
      expect(screen.getByLabelText(/message/i)).toHaveValue('This is a valid test message')
    })
  })
})