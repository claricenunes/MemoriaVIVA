/**
 * Returns YYYY-MM-DD using local time — avoids UTC offset bugs in Brazil (UTC-3).
 * Use instead of new Date().toISOString().split('T')[0] in browser code.
 */
export function localDateStr(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns YYYY-MM-DD for N days offset from today (local time).
 * offset=-1 → yesterday, offset=1 → tomorrow.
 */
export function localDateOffset(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return localDateStr(d)
}
