import { Link } from '@/i18n/navigation'
import { LayoutGrid } from 'lucide-react'
import { getLucideIcon } from '@/lib/education/get-lucide-icon'
import type { EducationCategory } from '@/lib/education/types'

interface CategoryPillsProps {
  categories: (EducationCategory & { count: number })[]
  totalCount: number
  activeSlug?: string
  basePath?: string
  allLabel?: string
}

export function CategoryPills({
                                categories,
                                totalCount,
                                activeSlug,
                                basePath = '/knowledge/seminars',
                                allLabel = 'Все материалы',
                              }: CategoryPillsProps) {
  return (
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        <Pill
            href={basePath}
            icon={LayoutGrid}
            label={allLabel}
            count={totalCount}
            active={!activeSlug}
        />
        {categories.map((category) => (
            <Pill
                key={category.id}
                href={`${basePath}?category=${category.slug}`}
                icon={getLucideIcon(category.icon)}
                label={category.name}
                count={category.count}
                active={activeSlug === category.slug}
            />
        ))}
      </div>
  )
}

function Pill({
                href,
                icon: Icon,
                label,
                count,
                active,
              }: {
  href: string
  icon: ReturnType<typeof getLucideIcon>
  label: string
  count: number
  active?: boolean
}) {
  return (
      <Link
          href={href}
          className={`flex shrink-0 items-center gap-3 rounded-xl border px-5 py-3.5 transition-colors ${
              active
                  ? 'border-[#155335] bg-white'
                  : 'border-[#EDE9E3] bg-white/60 hover:border-[#155335]/30'
          }`}
      >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDE9E3] text-[#155335]">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
        <span className="text-left">
        <span className="block text-sm font-medium text-[#1A1A1A]">{label}</span>
        <span className="block text-xs text-[#1A1A1A]/50">{count}</span>
      </span>
      </Link>
  )
}