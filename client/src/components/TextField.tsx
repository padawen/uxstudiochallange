import type { InputHTMLAttributes } from 'react'

import styles from './TextField.module.css'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = ({ error, id, label, value, ...props }: TextFieldProps) => (
  <label
    className={styles.field}
    data-error={Boolean(error)}
    data-filled={Boolean(String(value ?? '').trim())}
    htmlFor={id}
  >
    <span className={styles.label}>{label}</span>
    <input
      {...props}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={Boolean(error)}
      className={styles.input}
      id={id}
      value={value}
    />
    {error ? (
      <span className={styles.error} id={`${id}-error`}>
        {error}
      </span>
    ) : null}
  </label>
)
