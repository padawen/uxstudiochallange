import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  active?: boolean
  subtle?: boolean
  variant?: 'ghost' | 'filled'
}

export const IconButton = ({
  icon,
  active = false,
  className,
  subtle = false,
  variant = 'ghost',
  type = 'button',
  ...props
}: IconButtonProps) => (
  <button
    {...props}
    className={className ? `${styles.button} ${className}` : styles.button}
    data-active={active}
    data-subtle={subtle}
    data-variant={variant}
    type={type}
  >
    <span className={styles.icon}>{icon}</span>
  </button>
)
