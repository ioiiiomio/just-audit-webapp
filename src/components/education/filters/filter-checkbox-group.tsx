'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { FilterOption } from './filter-primitives'

interface FilterCheckboxGroupProps {
    title: string
    paramKey: string
    options: FilterOption[]
}

// NOTE: I don't have `filter-primitives.tsx`, so I can't match its exact
// internals — but since VideoFiltersSidebar (a plain server component) hands
// FilterRadioGroup only labels/options, not searchParams, that component must
// read the URL itself client-side. This follows the same shape: read the
// current value(s) via useSearchParams, write the new URL via useRouter.
export function FilterCheckboxGroup({ title, paramKey, options }: FilterCheckboxGroupProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const selected = new Set((searchParams.get(paramKey) ?? '').split(',').filter(Boolean))

    function toggle(value: string) {
        const next = new Set(selected)
        if (next.has(value)) next.delete(value)
        else next.add(value)

        const params = new URLSearchParams(searchParams.toString())
        if (next.size > 0) params.set(paramKey, Array.from(next).join(','))
        else params.delete(paramKey)
        params.delete('page') // any filter change resets pagination

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div>
            {title ? <h3 className="mb-3 font-serif text-base text-[#1A1A1A]">{title}</h3> : null}
            <div className="space-y-2.5">
                {options.map((option) => {
                    const checked = selected.has(option.value)
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggle(option.value)}
                            className="flex w-full items-center justify-between text-left text-sm"
                            aria-pressed={checked}
                        >
              <span className="flex items-center gap-2.5">
                <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked ? 'border-[#155335] bg-[#155335]' : 'border-[#1A1A1A]/20 bg-white'
                    }`}
                >
                  {checked ? (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth={2}>
                          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                  ) : null}
                </span>
                <span className="text-[#1A1A1A]/80">{option.label}</span>
              </span>
                            <span className="text-[#1A1A1A]/40">{option.count}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}