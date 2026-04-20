import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './PrimaryButton.module.css'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
}

export const PrimaryButton = ({
  children,
  icon,
  type = 'button',
  ...props
}: PrimaryButtonProps) => (
  <button {...props} className={styles.button} type={type}>
    {icon ? <span className={styles.icon}>{icon}</span> : null}
    <span className={styles.label}>{children}</span>
  </button>
)
