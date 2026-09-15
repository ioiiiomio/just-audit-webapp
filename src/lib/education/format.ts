export function formatDuration(seconds?: number | null): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  if (h > 0) return m > 0 ? `${h} ч ${m} мин` : `${h} ч`
  return `${m} мин`
}

export function formatClock(seconds?: number | null): string {
  if (!seconds) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function formatDate(date?: string | null, locale = 'ru'): string {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(date),
  )
}

export function formatShortDate(date?: string | null, locale = 'ru'): string {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(date),
  )
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

// Best-effort extraction of h2 headings from Payload's Lexical richText JSON,
// used to build the "Содержание" (table of contents) sidebar. Adjust the node
// shape here if your richText editor config differs.
export interface HeadingEntry {
  id: string
  text: string
}

export function extractHeadings(content: unknown): HeadingEntry[] {
  const root = (content as { root?: { children?: unknown[] } })?.root
  if (!root?.children) return []

  const headings: HeadingEntry[] = []
  let index = 0

  for (const node of root.children as Record<string, unknown>[]) {
    if (node.type === 'heading' && node.tag === 'h2') {
      const text = ((node.children as { text?: string }[]) ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim()
      if (text) {
        index += 1
        headings.push({ id: `section-${index}`, text })
      }
    }
  }

  return headings
}

export function getYoutubeThumbnail(url?: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export type VideoProvider = 'youtube' | 'youtube-shorts' | 'instagram' | 'unknown'

export function detectVideoProvider(url?: string | null): VideoProvider {
  if (!url) return 'unknown'
  if (/instagram\.com/i.test(url)) return 'instagram'
  if (/youtube\.com\/shorts\//i.test(url)) return 'youtube-shorts'
  if (/(youtube\.com|youtu\.be)/i.test(url)) return 'youtube'
  return 'unknown'
}

// уже есть getYoutubeId — дополняем паттерн под /shorts/
export function getYoutubeId(url?: string | null): string | null {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// instagram.com/reel/{id}/ или /p/{id}/
export function getInstagramPostUrl(url?: string | null): string | null {
  if (!url) return null
  const m = url.match(/instagram\.com\/(reel|p|tv)\/([^/?]+)/i)
  return m ? url.split('?')[0].replace(/\/$/, '') : null
}