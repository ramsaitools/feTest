import type { NextApiRequest, NextApiResponse } from 'next'

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ApiResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
}

// Proper email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * Removes `<` and `>` characters and trims surrounding whitespace to sanitize a user-provided string for safer processing.
 *
 * @param input - The raw user-provided string to sanitize
 * @returns The input with `'<`' and `>'` characters removed and leading/trailing whitespace trimmed
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}

/**
 * Validates contact form fields and returns per-field error messages.
 *
 * Performs presence checks and enforces these constraints:
 * - name: required, between 2 and 100 characters
 * - email: required, must match the email pattern, maximum 254 characters
 * - message: required, between 10 and 5000 characters
 *
 * @param data - The contact form data containing `name`, `email`, and `message`
 * @returns An object mapping field names to error messages; empty when there are no validation errors
 */
function validateContactForm(data: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  // Validate name with length constraints
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  } else if (data.email.length > 254) {
    errors.email = 'Email is too long'
  }

  // Validate message with length constraints
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  } else if (data.message.trim().length > 5000) {
    errors.message = 'Message must be less than 5000 characters'
  }

  return errors
}

/**
 * Handle contact form POST requests: sanitize inputs, validate them, and respond with success or error states.
 *
 * Accepts only POST; returns 405 for other methods. Sanitizes `name`, `email`, and `message`, validates them with
 * `validateContactForm`, and returns 400 with field errors when validation fails. On success, logs a sanitized
 * submission summary and returns a success message. On unexpected errors, logs server-side details and returns a
 * generic 500 error response.
 *
 * @param req - Incoming Next.js API request whose body should contain `{ name, email, message }`
 * @param res - Next.js API response used to send an `ApiResponse` back to the client
 * @returns The HTTP response containing an `ApiResponse` object describing success or failure
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { name, email, message } = req.body as ContactFormData

    // Sanitize all inputs to prevent XSS and injection attacks
    const userData: ContactFormData = {
      name: sanitizeInput(name || ''),
      email: sanitizeInput((email || '').toLowerCase()),
      message: sanitizeInput(message || ''),
    }

    const validationErrors = validateContactForm(userData)

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      })
    }

    // Log submission safely (without sensitive data)
    console.log('Contact form submission received:', {
      timestamp: new Date().toISOString(),
      nameLength: userData.name.length,
      emailDomain: userData.email.split('@')[1],
    })

    // Here you would typically:
    // 1. Use parameterized queries to prevent SQL injection
    // 2. Store in database securely
    // 3. Send email notification
    // Example: await db.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [userData.name, userData.email, userData.message])

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
    })
  } catch (error) {
    // Log error server-side but don't expose details to client
    console.error('Contact form error:', error)

    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
    })
  }
}