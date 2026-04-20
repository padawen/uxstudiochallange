import type { KeyboardEvent, MouseEvent } from 'react'

import type { Contact } from '../types/contact'
import { getContactName, sanitizePhoneHref } from '../utils/contact'
import { Avatar } from './Avatar'
import { IconButton } from './IconButton'
import { MoreIcon, MuteIcon, PhoneIcon } from './icons'
import { OverflowMenu } from './OverflowMenu'
import styles from './ContactListItem.module.css'

interface ContactListItemProps {
  active: boolean
  contact: Contact
  menuOpen: boolean
  onActivate: () => void
  onEdit: () => void
  onToggleFavorite: () => void
  onToggleMenu: () => void
  onRemove: () => void
}

export const ContactListItem = ({
  active,
  contact,
  menuOpen,
  onActivate,
  onEdit,
  onToggleFavorite,
  onToggleMenu,
  onRemove,
}: ContactListItemProps) => {
  const stop = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <div
      className={`${styles.item} ${active ? styles.itemActive : ''} ${menuOpen ? styles.menuOpen : ''}`}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.info}>
        <Avatar contact={contact} />
        <div className={styles.body}>
          <p className={styles.name}>{getContactName(contact)}</p>
          <p className={styles.meta}>{contact.phoneNumber}</p>
        </div>
      </div>
      <div className={styles.actions} onClick={stop}>
        <IconButton aria-label="Mute contact" icon={<MuteIcon />} />
        <a
          className={styles.callLink}
          href={sanitizePhoneHref(contact.phoneNumber)}
          onClick={stop}
        >
          <IconButton aria-label="Call contact" icon={<PhoneIcon />} />
        </a>
        <div className={styles.menuAnchor}>
          <IconButton
            active={menuOpen}
            aria-label="More actions"
            icon={<MoreIcon />}
            onClick={onToggleMenu}
          />
          {menuOpen ? (
            <OverflowMenu
              isFavorite={contact.isFavorite}
              onEdit={onEdit}
              onRemove={onRemove}
              onToggleFavorite={onToggleFavorite}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
