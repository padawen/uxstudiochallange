import { useMemo, useState } from 'react'

import { AppShell } from '../components/AppShell'
import { ContactFormOverlay } from '../components/ContactFormOverlay'
import { ContactList } from '../components/ContactList'
import { TopBar } from '../components/TopBar'
import { useContacts } from '../hooks/useContacts'
import type { Contact, ContactFormValues } from '../types/contact'
import {
  createEmptyContactFormValues,
  normalizeContactName,
  toContactFormValues,
} from '../utils/contact'
import styles from './ContactsPage.module.css'

type FormMode = 'add' | 'edit'

export const ContactsPage = () => {
  const {
    contacts,
    createContact,
    deleteContact,
    errorMessage,
    fetchContacts,
    isMutating,
    status,
    toggleFavorite,
    updateContact,
  } = useContacts()
  const [activeContactId, setActiveContactId] = useState<string | null>(null)
  const [menuOpenContactId, setMenuOpenContactId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('add')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const initialFormValues = useMemo<ContactFormValues>(
    () =>
      formMode === 'edit'
        ? toContactFormValues(editingContact)
        : createEmptyContactFormValues(),
    [editingContact, formMode],
  )

  const openAddForm = () => {
    setFormMode('add')
    setActiveContactId(null)
    setEditingContact(null)
    setMenuOpenContactId(null)
    setIsFormOpen(true)
  }

  const openEditForm = (contact: Contact) => {
    setFormMode('edit')
    setActiveContactId(null)
    setEditingContact(contact)
    setMenuOpenContactId(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
  }

  const handleSubmit = async (values: ContactFormValues) => {
    const payload = {
      name: normalizeContactName(values.name),
      phoneNumber: values.phoneNumber,
      email: values.email,
      avatarUrl: values.avatarUrl,
    }

    if (formMode === 'add') {
      await createContact(payload)
    } else if (editingContact) {
      await updateContact(editingContact.id, payload)
    }

    setMenuOpenContactId(null)
    setActiveContactId(null)
    setIsFormOpen(false)
  }

  const handleRemove = async (contact: Contact) => {
    await deleteContact(contact.id)
    setActiveContactId(null)
    setMenuOpenContactId(null)
  }

  return (
    <AppShell>
      <div className={styles.page}>
        <TopBar onAddContact={openAddForm} />
        {status === 'loading' ? (
          <p className={styles.message}>Loading contacts...</p>
        ) : null}
        {status === 'error' ? (
          <div className={styles.feedback}>
            <p className={styles.message}>{errorMessage ?? 'Unable to load contacts.'}</p>
            <button
              className={styles.retryButton}
              onClick={() => {
                void fetchContacts()
              }}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}
        {status === 'success' ? (
          <ContactList
            activeContactId={activeContactId}
            contacts={contacts}
            menuOpenContactId={menuOpenContactId}
            onActivate={(contact) => {
              if (window.innerWidth <= 900) {
                setActiveContactId((current) =>
                  current === contact.id ? null : contact.id,
                )
              }
            }}
            onEdit={openEditForm}
            onRemove={(contact) => {
              void handleRemove(contact)
            }}
            onToggleFavorite={(contact) => {
              void toggleFavorite(contact)
              setActiveContactId(null)
              setMenuOpenContactId(null)
            }}
            onToggleMenu={(contact) => {
              const menuIsOpening = menuOpenContactId !== contact.id
              setActiveContactId(menuIsOpening ? contact.id : null)
              setMenuOpenContactId(menuIsOpening ? contact.id : null)
            }}
          />
        ) : null}
        {isFormOpen ? (
          <ContactFormOverlay
            errorMessage={errorMessage}
            initialValues={initialFormValues}
            key={editingContact?.id ?? formMode}
            mode={formMode}
            onClose={closeForm}
            onSubmit={handleSubmit}
            submitting={isMutating}
          />
        ) : null}
      </div>
    </AppShell>
  )
}
