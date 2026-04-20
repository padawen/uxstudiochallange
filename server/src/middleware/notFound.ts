import type { RequestHandler } from 'express'

import { failure } from '../utils/http.js'

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(failure('Route not found.'))
}
