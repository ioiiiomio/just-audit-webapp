import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => Boolean(v)) as [string, string][],
    )
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  // Compact page list: 1 2 3 … last
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {sorted.map((page, i) => {
        const prev = sorted[i - 1]
        const showEllipsis = prev !== undefined && page - prev > 1
        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis ? <span className="px-1 text-[#1A1A1A]/40">…</span> : null}
            <Link
              href={buildHref(page)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm ${
                page === currentPage
                  ? 'border-[#155335] bg-[#155335] text-white'
                  : 'border-[#EDE9E3] bg-white text-[#1A1A1A] hover:border-[#155335]/30'
              }`}
            >
              {page}
            </Link>
          </span>
        )
      })}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="ml-2 flex h-10 items-center gap-2 rounded-lg border border-[#EDE9E3] bg-white px-4 text-sm text-[#1A1A1A] hover:border-[#155335]/30"
        >
          Следующая <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  )
}
