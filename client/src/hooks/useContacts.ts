import { useCallback, useEffect, useReducer } from 'react'

import { contactApi } from '../services/contactApi'
import { ApiClientError } from '../types/api'
import type {
  Contact,
  CreateContactPayload,
  UpdateContactPayload,
} from '../types/contact'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface ContactsState {
  contacts: Contact[]
  status: Status
  errorMessage: string | null
  isMutating: boolean
}

type ContactsAction =
  | { type: 'fetch:start' }
  | { type: 'fetch:success'; contacts: Contact[] }
  | { type: 'fetch:error'; message: string }
  | { type: 'mutation:start' }
  | { type: 'mutation:finish' }
  | { type: 'mutation:error'; message: string }
  | { type: 'contact:create'; contact: Contact }
  | { type: 'contact:update'; id: string; contact: Contact }
  | { type: 'contact:delete'; id: string }

const initialState: ContactsState = {
  contacts: [],
  status: 'loading',
  errorMessage: null,
  isMutating: false,
}

const orderContacts = (contacts: Contact[]) => {
  const favorites: Contact[] = []
  const others: Contact[] = []

  for (const contact of contacts) {
    if (contact.isFavorite) {
      favorites.push(contact)
      continue
    }

    others.push(contact)
  }

  return [...favorites, ...others]
}

const contactsReducer = (
  state: ContactsState,
  action: ContactsAction,
): ContactsState => {
  switch (action.type) {
    case 'fetch:start':
      return {
        ...state,
        status: 'loading',
        errorMessage: null,
      }
    case 'fetch:success':
      return {
        ...state,
        contacts: orderContacts(action.contacts),
        status: 'success',
      }
    case 'fetch:error':
      return {
        ...state,
        status: 'error',
        errorMessage: action.message,
      }
    case 'mutation:start':
      return {
        ...state,
        isMutating: true,
        errorMessage: null,
      }
    case 'mutation:finish':
      return {
        ...state,
        isMutating: false,
      }
    case 'mutation:error':
      return {
        ...state,
        errorMessage: action.message,
      }
    case 'contact:create':
      return {
        ...state,
        contacts: orderContacts([...state.contacts, action.contact]),
      }
    case 'contact:update':
      return {
        ...state,
        contacts: orderContacts(
          state.contacts.map((contact) =>
            contact.id === action.id ? action.contact : contact,
          ),
        ),
      }
    case 'contact:delete':
      return {
        ...state,
        contacts: orderContacts(
          state.contacts.filter((contact) => contact.id !== action.id),
        ),
      }
    default:
      return state
  }
}

const normalizeApiError = (error: unknown) => {
  if (error instanceof ApiClientError) {
    if (error.details) {
      const firstFieldErrors = Object.values(error.details).flat()
      if (firstFieldErrors.length > 0) {
        return firstFieldErrors[0]
      }
    }
    return error.message
  }

  return 'Something went wrong while talking to the server.'
}

export const useContacts = () => {
  const [state, dispatch] = useReducer(contactsReducer, initialState)

  const fetchContacts = useCallback(async () => {
    dispatch({ type: 'fetch:start' })

    try {
      const nextContacts = await contactApi.getContacts()
      dispatch({ type: 'fetch:success', contacts: nextContacts })
    } catch (error) {
      dispatch({
        type: 'fetch:error',
        message: normalizeApiError(error),
      })
    }
  }, [])

  useEffect(() => {
    void fetchContacts()
  }, [fetchContacts])

  const runMutation = useCallback(
    async <T,>(mutation: () => Promise<T>) => {
      dispatch({ type: 'mutation:start' })

      try {
        return await mutation()
      } catch (error) {
        const message = normalizeApiError(error)
        dispatch({ type: 'mutation:error', message })
        throw error
      } finally {
        dispatch({ type: 'mutation:finish' })
      }
    },
    [],
  )

  const createContact = useCallback(
    (payload: CreateContactPayload) =>
      runMutation(async () => {
        const created = await contactApi.createContact({
          ...payload,
        })
        dispatch({ type: 'contact:create', contact: created })
        return created
      }),
    [runMutation],
  )

  const updateContact = useCallback(
    (id: string, payload: UpdateContactPayload) =>
      runMutation(async () => {
        const updated = await contactApi.updateContact(id, {
          ...payload,
        })
        dispatch({ type: 'contact:update', id, contact: updated })
        return updated
      }),
    [runMutation],
  )

  const deleteContact = useCallback(
    (id: string) =>
      runMutation(async () => {
        await contactApi.deleteContact(id)
        dispatch({ type: 'contact:delete', id })
      }),
    [runMutation],
  )

  const toggleFavorite = useCallback(
    (contact: Contact) =>
      updateContact(contact.id, {
        isFavorite: !contact.isFavorite,
      }),
    [updateContact],
  )

  return {
    contacts: state.contacts,
    status: state.status,
    errorMessage: state.errorMessage,
    isMutating: state.isMutating,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
  }
}
