import type { Contact } from '../types/contact'
import { getContactName } from '../utils/contact'
import { PersonIcon } from './icons'

import styles from './Avatar.module.css'

interface AvatarProps {
  className?: string
  contact: Pick<Contact, 'name' | 'avatarUrl'>
  size?: 'small' | 'large'
}

export const Avatar = ({ className, contact, size = 'small' }: AvatarProps) => (
  <span
    className={`${styles.avatar} ${styles[size]} ${className ?? ''}`}
    data-has-image={Boolean(contact.avatarUrl)}
  >
    {contact.avatarUrl ? (
      <img
        alt={getContactName(contact)}
        className={styles.image}
        src={contact.avatarUrl}
      />
    ) : (
      <span className={styles.placeholder}>
        <PersonIcon className={styles.placeholderIcon} />
      </span>
    )}
  </span>
)
