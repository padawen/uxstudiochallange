import cors from 'cors'
import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'
import { contactRouter } from './routes/contactRoutes.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()')
  res.setHeader('Referrer-Policy', 'same-origin')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})
app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json({ limit: '8mb' }))
app.use('/uploads', express.static(join(process.cwd(), 'uploads')))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    data: {
      status: 'ok',
    },
    error: null,
  })
})

app.use('/api/contacts', contactRouter)
app.use('/contacts', contactRouter)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
