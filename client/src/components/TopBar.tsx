import { useEffect, useRef, useState } from 'react'

import { ArrowLeftIcon, GearIcon, LightModeIcon, PlusIcon } from './icons'
import { IconButton } from './IconButton'
import { PrimaryButton } from './PrimaryButton'
import styles from './TopBar.module.css'

interface TopBarProps {
  onAddContact: () => void
}

export const TopBar = ({ onAddContact }: TopBarProps) => {
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMobileSettingsOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setIsMobileSettingsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSettingsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileSettingsOpen])

  return (
    <header className={styles.header}>
      <div className={styles.side}>
        <IconButton aria-label="Back" icon={<ArrowLeftIcon />} />
      </div>
      <div className={styles.center}>
        <div className={styles.leading}>
          <div className={styles.mobileBack}>
            <IconButton aria-label="Back" icon={<ArrowLeftIcon />} />
          </div>
          <h1 className={styles.title}>Contacts</h1>
        </div>
        <div className={styles.actions}>
          <div className={styles.secondaryButtons}>
            <div className={styles.settingsAnchor} ref={settingsRef}>
              <IconButton
                active={isMobileSettingsOpen}
                aria-expanded={isMobileSettingsOpen}
                aria-haspopup="menu"
                aria-label="Settings"
                icon={<GearIcon />}
                onClick={() => {
                  setIsMobileSettingsOpen((current) => !current)
                }}
              />
              {isMobileSettingsOpen ? (
                <div className={styles.mobileSettingsMenu} role="menu">
                  <div className={styles.mobileSettingsItem} role="none">
                    <IconButton
                      aria-label="Theme"
                      className={styles.mobileSettingsAction}
                      icon={<LightModeIcon />}
                      role="menuitem"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <button aria-label="Profile" className={styles.profileButton} type="button">
              <img
                alt=""
                aria-hidden="true"
                className={styles.profile}
                src="/profile-pic.svg"
              />
            </button>
          </div>
          <PrimaryButton icon={<PlusIcon />} onClick={onAddContact}>
            Add new
          </PrimaryButton>
        </div>
      </div>
      <div className={`${styles.side} ${styles.trailing}`}>
        <IconButton aria-label="Theme" icon={<LightModeIcon />} />
      </div>
    </header>
  )
}
