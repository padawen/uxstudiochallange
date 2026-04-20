import { useRef } from 'react'

import { useContactForm } from '../hooks/useContactForm'
import type { ContactFormValues } from '../types/contact'
import { getInitials } from '../utils/contact'
import { fileToDataUrl } from '../utils/file'
import { Avatar } from './Avatar'
import { ChangeIcon, PlusIcon, TrashIcon } from './icons'
import { TextField } from './TextField'
import styles from './ContactFormOverlay.module.css'

interface ContactFormOverlayProps {
  mode: 'add' | 'edit'
  initialValues: ContactFormValues
  submitting: boolean
  errorMessage?: string | null
  onClose: () => void
  onSubmit: (values: ContactFormValues) => Promise<void>
}

export const ContactFormOverlay = ({
  mode,
  initialValues,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: ContactFormOverlayProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { errors, setField, validate, values } = useContactForm(initialValues)
  const avatarInitials = getInitials({ name: values.name || 'N A' })

  const handleSubmit = async () => {
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await onSubmit(values)
    } catch {
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget
    const file = input.files?.[0]

    if (!file) {
      return
    }

    const dataUrl = await fileToDataUrl(file)
    setField('avatarUrl', dataUrl)
    input.value = ''
  }

  return (
    <div className={styles.scrim}>
      <section
        aria-labelledby="contact-form-title"
        aria-modal="true"
        className={styles.dialog}
        data-mode={mode}
        role="dialog"
      >
        <div className={styles.body}>
          <div className={styles.info}>
            <h2 className={styles.title} id="contact-form-title">
              {mode === 'add' ? 'Add contact' : 'Edit contact'}
            </h2>
            <div className={styles.avatarRow}>
              <Avatar
                className={styles.avatarPreview}
                contact={{
                  name: avatarInitials,
                  avatarUrl: values.avatarUrl,
                }}
                size="large"
              />
              <div className={styles.avatarActions}>
                <button
                  className={styles.pictureButton}
                  data-has-image={Boolean(values.avatarUrl)}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <span className={styles.pictureIcon}>
                    {values.avatarUrl ? <ChangeIcon /> : <PlusIcon />}
                  </span>
                  {values.avatarUrl ? 'Change picture' : 'Add picture'}
                </button>
                {values.avatarUrl ? (
                  <button
                    aria-label="Remove picture"
                    className={styles.deleteButton}
                    onClick={() => setField('avatarUrl', null)}
                    type="button"
                  >
                    <TrashIcon />
                  </button>
                ) : null}
              </div>
            </div>
            <input
              accept="image/*"
              hidden
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />
            <TextField
              autoComplete="given-name"
              error={errors.name}
              id="name"
              label="Name"
              onChange={(event) => setField('name', event.target.value)}
              placeholder="Jamie Wright"
              value={values.name}
            />
            <TextField
              autoComplete="tel"
              error={errors.phoneNumber}
              id="phoneNumber"
              label="Phone number"
              onChange={(event) => setField('phoneNumber', event.target.value)}
              placeholder="+01 234 5678"
              value={values.phoneNumber}
            />
            <TextField
              autoComplete="email"
              error={errors.email}
              id="email"
              label="Email address"
              onChange={(event) => setField('email', event.target.value)}
              placeholder="jamie.wright@mail.com"
              type="email"
              value={values.email}
            />
            {errorMessage ? <p className={styles.serverError}>{errorMessage}</p> : null}
          </div>
          <div className={styles.footer}>
            <button
              className={styles.secondaryButton}
              disabled={submitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className={styles.primaryButton}
              disabled={submitting || !values.name.trim()}
              onClick={() => {
                void handleSubmit()
              }}
              type="button"
            >
              {submitting ? 'Saving...' : 'Done'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
