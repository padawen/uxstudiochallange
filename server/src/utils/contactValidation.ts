import { z } from 'zod'

const optionalEmailSchema = z
  .string()
  .trim()
  .max(120)
  .refine((value) => value === '' || z.email().safeParse(value).success, {
    message: 'Email must be valid.',
  })

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === '' || /^[+\d()\-\s]+$/.test(value), {
    message: 'Phone number contains unsupported characters.',
  })

const optionalAvatarSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.startsWith('data:image/') ||
      value.startsWith('http://') ||
      value.startsWith('https://'),
    'Avatar must be a supported image value.',
  )

const baseSchema = z.object({
  name: z.string().trim().max(120),
  phoneNumber: optionalPhoneSchema,
  email: optionalEmailSchema,
  avatarUrl: optionalAvatarSchema.nullish(),
  isFavorite: z.boolean().optional(),
})

export const createContactSchema = baseSchema.refine((value) => value.name.length > 0, {
  message: 'Name is required.',
  path: ['name'],
})

export const updateContactSchema = baseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided.',
  })
