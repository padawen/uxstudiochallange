import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { AppError } from '../utils/errors.js'
import { failure } from '../utils/http.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(failure(error.message, error.details))
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json(
      failure('Validation failed.', error.flatten().fieldErrors),
    )
    return
  }

  if (error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed') {
    res.status(400).json(failure('Invalid JSON payload.'))
    return
  }

  if ('type' in error && error.type === 'entity.too.large') {
    res.status(413).json(failure('Request payload is too large.'))
    return
  }

  console.error(error)
  res.status(500).json(failure('Internal server error.'))
}
