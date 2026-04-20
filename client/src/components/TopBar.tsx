import { useEffect, useRef, useState } from 'react'

import { ArrowLeftIcon, GearIcon, LightModeIcon, PlusIcon } from './icons'
import { IconButton } from './IconButton'
import { PrimaryButton } from './PrimaryButton'
import styles from './TopBar.module.css'

interface TopBarProps {
  onAddContact: () => void
}

export const TopBar = ({ onAddContact }: TopBarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const settingsRef = useRef<HTMLDivElement | null>(null)

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
    document.documentElement.setAttribute(
      'data-theme',
      !isDarkMode ? 'dark' : 'light',
    )
  }

  useEffect(() => {
    if (!isSettingsOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isSettingsOpen])

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
                active={isSettingsOpen && typeof window !== 'undefined' && window.innerWidth <= 900}
                aria-expanded={isSettingsOpen}
                aria-haspopup="menu"
                aria-label="Settings"
                icon={<GearIcon />}
                onClick={() => {
                  if (window.innerWidth <= 900) {
                    setIsSettingsOpen((current) => !current)
                  }
                }}
              />
              {isSettingsOpen ? (
                <div className={styles.settingsMenu} role="menu">
                  <div className={styles.settingsItem} role="none">
                    <IconButton
                      aria-label="Toggle Theme"
                      className={styles.settingsAction}
                      icon={<LightModeIcon />}
                      onClick={toggleTheme}
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
        <IconButton
          aria-label="Toggle Theme"
          icon={<LightModeIcon />}
          onClick={toggleTheme}
        />
      </div>
    </header>
  )
}
