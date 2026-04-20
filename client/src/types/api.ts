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

export class ApiClientError extends Error {
  public readonly details?: Record<string, string[]>

  constructor(message: string, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiClientError'
    this.details = details
  }
}
