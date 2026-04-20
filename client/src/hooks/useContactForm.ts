import { useMemo, useState } from 'react'

import type { ContactFormErrors, ContactFormValues } from '../types/contact'
import {
  createEmptyContactFormValues,
  validateContactForm,
} from '../utils/contact'

export const useContactForm = (
  initialValues?: ContactFormValues,
) => {
  const fallbackValues = useMemo(
    () => initialValues ?? createEmptyContactFormValues(),
    [initialValues],
  )
  const [values, setValues] = useState<ContactFormValues>(fallbackValues)
  const [errors, setErrors] = useState<ContactFormErrors>({})

  const setField = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  const validate = () => {
    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    return nextErrors
  }

  return {
    values,
    errors,
    setField,
    setValues,
    validate,
  }
}
