'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, LayoutGrid, List } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'title', label: 'По названию' },
]

export function SearchSortBar({ resultsCount, resultsLabel = 'материалов' }: { resultsCount: number; resultsLabel?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const view = searchParams.get('view') ?? 'grid'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateParam('q', query)}
            onBlur={() => updateParam('q', query)}
            placeholder="Поиск по названию или описанию..."
            className="w-full rounded-lg border border-[#EDE9E3] bg-white py-3 pl-11 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#155335] focus:outline-none"
          />
        </div>

        <select
          defaultValue={searchParams.get('sort') ?? 'newest'}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#155335] focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-lg border border-[#EDE9E3]">
          <button
            type="button"
            onClick={() => updateParam('view', 'grid')}
            aria-label="Сетка"
            className={`flex h-11 w-11 items-center justify-center ${view === 'grid' ? 'bg-[#155335] text-white' : 'bg-white text-[#1A1A1A]/60'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => updateParam('view', 'list')}
            aria-label="Список"
            className={`flex h-11 w-11 items-center justify-center border-l border-[#EDE9E3] ${view === 'list' ? 'bg-[#155335] text-white' : 'bg-white text-[#1A1A1A]/60'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-[#1A1A1A]/50">
        Найдено {resultsLabel}: {resultsCount}
      </p>
    </div>
  )
}
