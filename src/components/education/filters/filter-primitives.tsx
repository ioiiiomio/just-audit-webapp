'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { RotateCcw } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
  count: number
}

function useFilterParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function toggleListParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = new Set(params.get(key)?.split(',').filter(Boolean))
    if (current.has(value)) current.delete(value)
    else current.add(value)
    if (current.size) params.set(key, [...current].join(','))
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return { searchParams, setParam, toggleListParam }
}

// Single-select circular radio list, e.g. "Все категории / Аудит / Налоги..."
export function FilterRadioGroup({
  title,
  paramKey,
  allLabel,
  allCount,
  options,
}: {
  title: string
  paramKey: string
  allLabel: string
  allCount: number
  options: FilterOption[]
}) {
  const { searchParams, setParam } = useFilterParams()
  const active = searchParams.get(paramKey)

  return (
    <fieldset className="border-b border-[#EDE9E3] pb-6">
      <legend className="mb-4 font-serif text-base text-[#1A1A1A]">{title}</legend>
      <div className="space-y-3">
        <RadioRow label={allLabel} count={allCount} checked={!active} onSelect={() => setParam(paramKey, null)} />
        {options.map((opt) => (
          <RadioRow
            key={opt.value}
            label={opt.label}
            count={opt.count}
            checked={active === opt.value}
            onSelect={() => setParam(paramKey, opt.value)}
          />
        ))}
      </div>
    </fieldset>
  )
}

function RadioRow({
  label,
  count,
  checked,
  onSelect,
}: {
  label: string
  count: number
  checked: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-2 text-left text-sm"
    >
      <span className="flex items-center gap-2.5 text-[#1A1A1A]">
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            checked ? 'border-[#155335]' : 'border-[#1A1A1A]/25'
          }`}
        >
          {checked ? <span className="h-2 w-2 rounded-full bg-[#155335]" /> : null}
        </span>
        {label}
      </span>
      <span className="text-[#1A1A1A]/40">{count}</span>
    </button>
  )
}

// Multi-select checkbox list, e.g. "Тип материала", "Уровень", "Формат"
export function FilterCheckboxGroup({
  title,
  paramKey,
  options,
  initiallyShown = options.length,
}: {
  title: string
  paramKey: string
  options: FilterOption[]
  initiallyShown?: number
}) {
  const { searchParams, toggleListParam } = useFilterParams()
  const active = new Set(searchParams.get(paramKey)?.split(',').filter(Boolean))
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? options : options.slice(0, initiallyShown)

  return (
    <fieldset className="border-b border-[#EDE9E3] pb-6">
      <legend className="mb-4 font-serif text-base text-[#1A1A1A]">{title}</legend>
      <div className="space-y-3">
        {visible.map((opt) => (
          <label key={opt.value} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2.5 text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={active.has(opt.value)}
                onChange={() => toggleListParam(paramKey, opt.value)}
                className="h-4 w-4 rounded border-[#1A1A1A]/25 accent-[#155335]"
              />
              {opt.label}
            </span>
            <span className="text-[#1A1A1A]/40">{opt.count}</span>
          </label>
        ))}
      </div>
      {options.length > initiallyShown ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm text-[#155335] hover:underline"
        >
          {expanded ? 'Скрыть' : 'Показать еще'}
        </button>
      ) : null}
    </fieldset>
  )
}

// Dual-thumb duration range, e.g. "5 мин — 2+ часа"
export function DurationRangeFilter({
  min,
  max,
  step = 5,
}: {
  min: number
  max: number
  step?: number
}) {
  const { searchParams, setParam } = useFilterParams()
  const [from, setFrom] = useState(Number(searchParams.get('durationFrom')) || min)
  const [to, setTo] = useState(Number(searchParams.get('durationTo')) || max)

  function commit(nextFrom: number, nextTo: number) {
    setParam('durationFrom', nextFrom === min ? null : String(nextFrom))
    setParam('durationTo', nextTo === max ? null : String(nextTo))
  }

  // Inlined rather than accepted as a prop: functions can't cross the
  // server → client component boundary, and this component is always
  // rendered from a server-component sidebar.
  function formatValue(minutes: number) {
    if (minutes >= max) return `${Math.round(max / 60)}+ часа`
    if (minutes >= 60) return `${Math.round((minutes / 60) * 10) / 10} ч`
    return `${minutes} мин`
  }

  return (
    <fieldset className="pb-2">
      <legend className="mb-4 font-serif text-base text-[#1A1A1A]">Длительность</legend>
      <div className="mb-3 flex justify-between text-xs text-[#1A1A1A]/50">
        <span>{formatValue(from)}</span>
        <span>{formatValue(to)}</span>
      </div>
      <div className="relative h-1 rounded-full bg-[#EDE9E3]">
        <div
          className="absolute h-1 rounded-full bg-[#155335]"
          style={{
            left: `${((from - min) / (max - min)) * 100}%`,
            right: `${100 - ((to - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <div className="relative mt-[-4px] h-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), to - step)
            setFrom(next)
          }}
          onMouseUp={() => commit(from, to)}
          onTouchEnd={() => commit(from, to)}
          className="pointer-events-auto absolute top-0 h-4 w-full appearance-none bg-transparent accent-[#155335]"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={to}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), from + step)
            setTo(next)
          }}
          onMouseUp={() => commit(from, to)}
          onTouchEnd={() => commit(from, to)}
          className="pointer-events-auto absolute top-0 h-4 w-full appearance-none bg-transparent accent-[#155335]"
        />
      </div>
    </fieldset>
  )
}

export function ResetFiltersLink() {
  const pathname = usePathname()
  return (
    <a href={pathname} className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/60 hover:text-[#155335]">
      <RotateCcw className="h-4 w-4" />
      Сбросить фильтры
    </a>
  )
}
