import type {
  Contact,
  ContactFormErrors,
  ContactFormValues,
} from '../types/contact'

const collapseWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ')

export const getContactName = (contact: Pick<Contact, 'name'>) =>
  collapseWhitespace(contact.name) || 'Unnamed contact'

export const normalizeContactName = (value: string) => collapseWhitespace(value)

export const getInitials = (contact: Pick<Contact, 'name'>) => {
  const fullName = getContactName(contact)
  const parts = fullName.split(' ')
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts[1]?.charAt(0) ?? ''

  return `${first}${second || first}`.toUpperCase()
}

export const sanitizePhoneHref = (phoneNumber: string) =>
  `tel:${phoneNumber.replace(/[^\d+]/g, '')}`

export const createEmptyContactFormValues = (): ContactFormValues => ({
  name: '',
  phoneNumber: '',
  email: '',
  avatarUrl: null,
})

export const toContactFormValues = (
  contact?: Contact | null,
): ContactFormValues =>
  contact
    ? {
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        avatarUrl: contact.avatarUrl,
      }
    : createEmptyContactFormValues()

const emailPattern = /\S+@\S+\.\S+/
const phonePattern = /^[+\d()\-\s]+$/

export const validateContactForm = (
  values: ContactFormValues,
): ContactFormErrors => {
  const errors: ContactFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (values.phoneNumber.trim() && !phonePattern.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone number contains unsupported characters.'
  }

  if (values.email.trim() && !emailPattern.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}
