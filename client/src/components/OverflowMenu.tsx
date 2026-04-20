import { useLayoutEffect, useRef, useState } from 'react'

import { GearIcon, HeartFilledIcon, HeartIcon, TrashIcon } from './icons'
import styles from './OverflowMenu.module.css'

interface OverflowMenuProps {
  isFavorite: boolean
  onEdit: () => void
  onToggleFavorite: () => void
  onRemove: () => void
}

export const OverflowMenu = ({
  isFavorite,
  onEdit,
  onToggleFavorite,
  onRemove,
}: OverflowMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [direction, setDirection] = useState<'down' | 'up'>('down')

  useLayoutEffect(() => {
    const menu = menuRef.current

    if (!menu) {
      return
    }

    const rect = menu.getBoundingClientRect()
    const wouldOverflowBottom = rect.bottom > window.innerHeight - 16
    const hasRoomAbove = rect.top >= rect.height + 16

    setDirection(wouldOverflowBottom && hasRoomAbove ? 'up' : 'down')
  }, [])

  return (
    <div
      className={styles.menu}
      data-direction={direction}
      ref={menuRef}
      role="menu"
    >
      <button className={styles.item} onClick={onEdit} role="menuitem" type="button">
        <span className={styles.icon}>
          <GearIcon />
        </span>
        <span>Edit</span>
      </button>
      <button className={styles.item} onClick={onToggleFavorite} role="menuitem" type="button">
        <span className={styles.icon}>
          {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
        </span>
        <span>{isFavorite ? 'Unfavourite' : 'Favourite'}</span>
      </button>
      <button
        className={`${styles.item} ${styles.danger}`}
        onClick={onRemove}
        role="menuitem"
        type="button"
      >
        <span className={styles.icon}>
          <TrashIcon />
        </span>
        <span>Remove</span>
      </button>
    </div>
  )
}
