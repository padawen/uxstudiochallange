import type {
  CreateContactPayload,
  UpdateContactPayload,
} from '../types/contact.js'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'

export const contactService = {
  async list() {
    return prisma.contact.findMany({
      orderBy: [
        { isFavorite: 'desc' },
        { createdAt: 'asc' },
      ],
    })
  },

  async getById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      throw new AppError('Contact not found.', 404)
    }

    return contact
  },

  async create(payload: CreateContactPayload) {
    return prisma.contact.create({
      data: {
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        avatarUrl: payload.avatarUrl ?? null,
        isFavorite: payload.isFavorite ?? false,
      },
    })
  },

  async update(id: string, payload: UpdateContactPayload) {
    await this.getById(id)

    return prisma.contact.update({
      where: { id },
      data: payload,
    })
  },

  async remove(id: string) {
    await this.getById(id)
    await prisma.contact.delete({
      where: { id },
    })
  },
}
