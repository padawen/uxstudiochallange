import type { Contact } from '../types/contact'
import { ContactListItem } from './ContactListItem'
import styles from './ContactList.module.css'

interface ContactListProps {
  activeContactId: string | null
  contacts: Contact[]
  menuOpenContactId: string | null
  onActivate: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onToggleFavorite: (contact: Contact) => void
  onToggleMenu: (contact: Contact) => void
  onRemove: (contact: Contact) => void
}

export const ContactList = ({
  activeContactId,
  contacts,
  menuOpenContactId,
  onActivate,
  onEdit,
  onToggleFavorite,
  onToggleMenu,
  onRemove,
}: ContactListProps) => (
  <div className={styles.list}>
    {contacts.map((contact) => (
      <ContactListItem
        active={activeContactId === contact.id}
        contact={contact}
        key={contact.id}
        menuOpen={menuOpenContactId === contact.id}
        onActivate={() => onActivate(contact)}
        onEdit={() => onEdit(contact)}
        onRemove={() => onRemove(contact)}
        onToggleFavorite={() => onToggleFavorite(contact)}
        onToggleMenu={() => onToggleMenu(contact)}
      />
    ))}
  </div>
)
