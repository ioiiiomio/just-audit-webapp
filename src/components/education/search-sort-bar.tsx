'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react'

interface SortOption {
    value: string
    label: string
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'title', label: 'По названию' },
]

export function SearchSortBar({
                                  resultsCount,
                                  resultsLabel = 'материалов',
                                  sortOptions = DEFAULT_SORT_OPTIONS,
                                  searchPlaceholder = 'Поиск по названию или описанию...',
                                  gridViewLabel = 'Сетка',
                                  listViewLabel = 'Список',
                                  foundLabel = 'Найдено',
                                  showViewToggle = true,
                              }: {
    resultsCount: number
    resultsLabel?: string
    sortOptions?: SortOption[]
    searchPlaceholder?: string
    gridViewLabel?: string
    listViewLabel?: string
    foundLabel?: string
    /** Hide where the page ignores `view` (e.g. the grouped-by-topic carousels). */
    showViewToggle?: boolean
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const urlQuery = searchParams.get('q') ?? ''
    const [query, setQuery] = useState(urlQuery)

    // Keep the input in sync when the URL changes elsewhere (e.g. "Сбросить фильтры").
    useEffect(() => {
        setQuery(urlQuery)
    }, [urlQuery])

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        params.delete('page')
        const qs = params.toString()
        startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
    }

    function commitQuery() {
        const next = query.trim()
        if (next !== urlQuery) updateParam('q', next)
    }

    const view = searchParams.get('view') === 'list' ? 'list' : 'grid'
    const currentSort = searchParams.get('sort') ?? sortOptions[0]?.value ?? ''

    return (
        <div className={`flex flex-col gap-4 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && commitQuery()}
                        onBlur={commitQuery}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-lg border border-[#EDE9E3] bg-white py-3 pl-11 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#155335] focus:outline-none"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="relative min-w-0 flex-1 sm:flex-none">
                        <select
                            value={currentSort}
                            onChange={(e) => updateParam('sort', e.target.value)}
                            className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#EDE9E3] bg-white pl-4 pr-11 text-sm text-[#1A1A1A] transition hover:border-[#155335]/30 focus:border-[#155335] focus:outline-none sm:w-auto"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/50"
                            aria-hidden
                        />
                    </div>

                    {showViewToggle ? (
                        <div className="flex shrink-0 overflow-hidden rounded-lg border border-[#EDE9E3]">
                            <button
                                type="button"
                                onClick={() => updateParam('view', '')}
                                aria-label={gridViewLabel}
                                aria-pressed={view === 'grid'}
                                className={`flex h-11 w-11 items-center justify-center transition ${
                                    view === 'grid' ? 'bg-[#155335] text-white' : 'bg-white text-[#1A1A1A]/60 hover:text-[#155335]'
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => updateParam('view', 'list')}
                                aria-label={listViewLabel}
                                aria-pressed={view === 'list'}
                                className={`flex h-11 w-11 items-center justify-center border-l border-[#EDE9E3] transition ${
                                    view === 'list' ? 'bg-[#155335] text-white' : 'bg-white text-[#1A1A1A]/60 hover:text-[#155335]'
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            <p className="text-sm text-[#1A1A1A]/50">
                {foundLabel} {resultsLabel}: {resultsCount}
            </p>
        </div>
    )
}