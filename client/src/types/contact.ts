export interface Contact {
  id: string
  name: string
  phoneNumber: string
  email: string
  avatarUrl: string | null
  isFavorite: boolean
}

export interface CreateContactPayload {
  name: string
  phoneNumber: string
  email: string
  avatarUrl?: string | null
  isFavorite?: boolean
}

export interface UpdateContactPayload {
  name?: string
  phoneNumber?: string
  email?: string
  avatarUrl?: string | null
  isFavorite?: boolean
}

export interface ContactFormValues {
  name: string
  phoneNumber: string
  email: string
  avatarUrl: string | null
}

export interface ContactFormErrors {
  name?: string
  phoneNumber?: string
  email?: string
}
