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

export interface ApiSuccessResponse<T> {
  data: T
  error: null
}

export interface ApiErrorResponse {
  data: null
  error: {
    message: string
    details?: Record<string, string[]>
  }
}
