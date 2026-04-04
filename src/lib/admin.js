export const ADMIN_CODE = 'admin123'

export function requestAdminCode(actionLabel = 'continue') {
  const input = window.prompt(`Enter admin code to ${actionLabel}:`)
  if (input === null) return false
  return input === ADMIN_CODE
}
