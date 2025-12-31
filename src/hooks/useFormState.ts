'use client'

import { useState, useCallback, ChangeEvent } from 'react'

export interface FormErrors {
  [key: string]: string | undefined
}

export interface UseFormStateOptions<T> {
  initialValues: T
  validate?: (values: T) => FormErrors
  onSubmit?: (values: T) => void | Promise<void>
}

/**
 * Custom hook for managing form state with validation
 *
 * @param options - Form configuration with initial values, validation, and submit handler
 * @returns Form state and handlers
 */
export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>
) {
  const { initialValues, validate, onSubmit } = options

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const handleChange = useCallback(
    (field: keyof T) => (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const newValue = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value

      setValues(prev => ({
        ...prev,
        [field]: newValue,
      }))

      // Clear error for this field when user types
      if (errors[field as string]) {
        setErrors(prev => ({
          ...prev,
          [field as string]: undefined,
        }))
      }
    },
    [errors]
  )

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(prev => ({
        ...prev,
        [field as string]: true,
      }))

      // Validate single field on blur
      if (validate) {
        const fieldErrors = validate(values)
        if (fieldErrors[field as string]) {
          setErrors(prev => ({
            ...prev,
            [field as string]: fieldErrors[field as string],
          }))
        }
      }
    },
    [values, validate]
  )

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field as string]: error,
    }))
  }, [])

  const validateForm = useCallback((): boolean => {
    if (!validate) {
      setIsValid(true)
      return true
    }

    const validationErrors = validate(values)
    setErrors(validationErrors)

    const hasErrors = Object.keys(validationErrors).length > 0
    setIsValid(!hasErrors)

    return !hasErrors
  }, [values, validate])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
      setTouched(allTouched)

      // Validate
      if (!validateForm()) {
        return
      }

      if (onSubmit) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [values, validateForm, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setIsValid(true)
  }, [initialValues])

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      name: field as string,
      value: values[field] ?? '',
      onChange: handleChange(field),
      onBlur: handleBlur(field),
    }),
    [values, handleChange, handleBlur]
  )

  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return touched[field as string] ? errors[field as string] : undefined
    },
    [touched, errors]
  )

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    validateForm,
    resetForm,
    getFieldProps,
    getFieldError,
  }
}
