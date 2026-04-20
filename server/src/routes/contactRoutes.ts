import { Router } from 'express'

import {
  createContact,
  deleteContact,
  getContact,
  listContacts,
  updateContact,
} from '../controllers/contactController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const contactRouter = Router()

contactRouter.get('/', asyncHandler(listContacts))
contactRouter.get('/:id', asyncHandler(getContact))
contactRouter.post('/', asyncHandler(createContact))
contactRouter.put('/:id', asyncHandler(updateContact))
contactRouter.delete('/:id', asyncHandler(deleteContact))
