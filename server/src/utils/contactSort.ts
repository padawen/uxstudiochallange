import type { Contact } from '../types/contact.js'

const compareText = (left: string, right: string) =>
  left.localeCompare(right, undefined, { sensitivity: 'base' })

export const sortContacts = (contacts: Contact[]) =>
  [...contacts].sort((left, right) => {
    if (left.isFavorite !== right.isFavorite) {
      return left.isFavorite ? -1 : 1
    }

    return compareText(left.name, right.name)
  })
