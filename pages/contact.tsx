import React, { useState, FormEvent, ChangeEvent } from 'react'
import styles from './contact.module.css'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface ApiResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
}

// Proper email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * Render the contact page with a controlled form that validates inputs, displays inline errors, and submits data to the server.
 *
 * @returns The contact page React element containing the form, validation state, submission status, and client-side handlers for change, blur, and submit.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 100) return 'Name must be less than 100 characters'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address'
        if (value.length > 254) return 'Email is too long'
        return undefined
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        if (value.trim().length > 5000) return 'Message must be less than 5000 characters'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    ;(Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof FormData, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const error = validateField(name as keyof FormData, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus({ type: null, message: '' })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message })
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
      } else {
        if (data.errors) {
          setErrors(data.errors)
        }
        setSubmitStatus({ type: 'error', message: data.message })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.contactPage}>
      <h1>Contact Us</h1>
      <p className={styles.contactDescription}>
        Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {submitStatus.type && (
        <div
          className={`${styles.alert} ${submitStatus.type === 'success' ? styles.alertSuccess : styles.alertError}`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="Your name"
            minLength={2}
            maxLength={100}
          />
          {errors.name && (
            <span id="name-error" className={styles.errorMessage} role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="your.email@example.com"
            maxLength={254}
          />
          {errors.email && (
            <span id="email-error" className={styles.errorMessage} role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">
            Message <span className={styles.required}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Your message (minimum 10 characters)"
            rows={6}
            minLength={10}
            maxLength={5000}
          />
          <div className={styles.charCount}>
            {formData.message.length}/5000 characters
          </div>
          {errors.message && (
            <span id="message-error" className={styles.errorMessage} role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}