import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api'
import { ApiClientError } from '../types/api'
import type {
  Contact,
  CreateContactPayload,
  UpdateContactPayload,
} from '../types/contact'

const parsePayload = async <T>(
  response: Response,
): Promise<ApiSuccessResponse<T> | ApiErrorResponse | null> => {
  const rawBody = await response.text()

  if (!rawBody) {
    return null
  }

  try {
    return JSON.parse(rawBody) as ApiSuccessResponse<T> | ApiErrorResponse
  } catch {
    throw new ApiClientError('Server returned an invalid response.')
  }
}

const request = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  let response: Response

  try {
    response = await fetch(input, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })
  } catch {
    throw new ApiClientError('Unable to reach the server. Check your connection and try again.')
  }

  const payload = await parsePayload<T>(response)

  if (!response.ok) {
    if (payload?.error) {
      throw new ApiClientError(payload.error.message, payload.error.details)
    }

    throw new ApiClientError(`Request failed with status ${response.status}.`)
  }

  if (!payload || payload.error) {
    throw new ApiClientError(payload?.error?.message ?? 'Server returned an unexpected response.')
  }

  return payload.data
}

export const contactApi = {
  getContacts: () => request<Contact[]>('/api/contacts'),
  getContact: (id: string) => request<Contact>(`/api/contacts/${id}`),
  createContact: (payload: CreateContactPayload) =>
    request<Contact>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateContact: (id: string, payload: UpdateContactPayload) =>
    request<Contact>(`/api/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteContact: (id: string) =>
    request<{ id: string }>(`/api/contacts/${id}`, {
      method: 'DELETE',
    }),
}
