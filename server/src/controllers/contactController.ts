import type { RequestHandler } from 'express'
import { ZodError } from 'zod'

import { contactService } from '../services/contactService.js'
import {
  createContactSchema,
  updateContactSchema,
} from '../utils/contactValidation.js'
import { AppError } from '../utils/errors.js'
import { success } from '../utils/http.js'

const parse = <T>(schema: { parse: (input: unknown) => T }, input: unknown) => {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError('Validation failed.', 400, error.flatten().fieldErrors)
    }

    throw error
  }
}

const getParamId = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value ?? ''

export const listContacts: RequestHandler = async (_req, res) => {
  const contacts = await contactService.list()
  res.status(200).json(success(contacts))
}

export const getContact: RequestHandler = async (req, res) => {
  const contact = await contactService.getById(getParamId(req.params.id))
  res.status(200).json(success(contact))
}

export const createContact: RequestHandler = async (req, res) => {
  const payload = parse(createContactSchema, req.body)
  const contact = await contactService.create(payload)
  res.status(201).json(success(contact))
}

export const updateContact: RequestHandler = async (req, res) => {
  const payload = parse(updateContactSchema, req.body)
  const contact = await contactService.update(getParamId(req.params.id), payload)
  res.status(200).json(success(contact))
}

export const deleteContact: RequestHandler = async (req, res) => {
  const id = getParamId(req.params.id)
  await contactService.remove(id)
  res.status(200).json(success({ id }))
}
