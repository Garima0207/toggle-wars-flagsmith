// Flagsmith setup shared by the app.
//
// Experiments join exposures and conversions per identity, so every visitor
// gets a stable anonymous ID that we keep in localStorage.

export const FLAG_KEY = 'card_layout'
export const CONVERSION_EVENT = 'connect_clicked'

// Variant values configured on the multivariate flag in Flagsmith.
export type CardLayout = 'bio' | 'skills'
export const CONTROL: CardLayout = 'bio'

export const ENVIRONMENT_KEY = import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY as string | undefined

const ID_STORAGE_KEY = 'tw_visitor_id'

export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(ID_STORAGE_KEY)
    if (existing) return existing
    const id = `visitor_${crypto.randomUUID()}`
    localStorage.setItem(ID_STORAGE_KEY, id)
    return id
  } catch {
    // Private mode or storage blocked: fall back to a per-session ID.
    return `visitor_${crypto.randomUUID()}`
  }
}

export function toLayout(value: unknown): CardLayout {
  return value === 'skills' ? 'skills' : CONTROL
}
