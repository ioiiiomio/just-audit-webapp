import type { FieldHook } from 'payload'

// Strips leading/trailing slashes and whitespace, lowercases, and replaces
// spaces with hyphens. Attach to any `slug` field's `hooks.beforeValidate`
// so a stray "/testvid" or " Audit " can't slip through from manual typing.
export const sanitizeSlug: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value

  return value
    .trim()
    .replace(/^\/+|\/+$/g, '') // strip leading/trailing slashes
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') // drop anything that isn't a-z, 0-9, or hyphen
}
