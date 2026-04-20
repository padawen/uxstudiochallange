import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../types/contact.js'

export const success = <T>(data: T): ApiSuccessResponse<T> => ({
  data,
  error: null,
})

export const failure = (
  message: string,
  details?: Record<string, string[]>,
): ApiErrorResponse => ({
  data: null,
  error: {
    message,
    details,
  },
})
