import { FilterCheckboxGroup, FilterRadioGroup, ResetFiltersLink, type FilterOption } from './filter-primitives'

interface MaterialFiltersSidebarProps {
    totalCount: number
    materialTypes: FilterOption[]
    topics: FilterOption[]
    filtersTitle?: string
    materialTypeLabel?: string
    topicsLabel?: string
    allTopicsLabel?: string
}

export function MaterialFiltersSidebar({
                                           totalCount,
                                           materialTypes,
                                           topics,
                                           filtersTitle = 'Фильтры',
                                           materialTypeLabel = 'Тип материала',
                                           topicsLabel = 'Темы',
                                           allTopicsLabel = 'Все темы',
                                       }: MaterialFiltersSidebarProps) {
    return (
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <h2 className="font-serif text-lg text-[#1A1A1A]">{filtersTitle}</h2>

            <FilterCheckboxGroup title={materialTypeLabel} paramKey="type" options={materialTypes} />
            <FilterRadioGroup
                title={topicsLabel}
                paramKey="topic"
                allLabel={allTopicsLabel}
                allCount={totalCount}
                options={topics}
            />

            <ResetFiltersLink />
        </aside>
    )
}