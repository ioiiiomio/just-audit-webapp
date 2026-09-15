import { FilterRadioGroup, ResetFiltersLink, type FilterOption } from './filter-primitives'
import { FilterCheckboxGroup } from './filter-checkbox-group'

interface MaterialsFiltersSidebarProps {
    typeOptions: FilterOption[]
    topics: FilterOption[]
    totalCount: number
    filtersTitle?: string
    materialTypeLabel?: string
    topicsLabel?: string
    allTopicsLabel?: string
}

export function MaterialsFiltersSidebar({
                                            typeOptions,
                                            topics,
                                            totalCount,
                                            filtersTitle = 'Фильтры',
                                            materialTypeLabel = 'Тип материала',
                                            topicsLabel = 'Темы',
                                            allTopicsLabel = 'Все темы',
                                        }: MaterialsFiltersSidebarProps) {
    return (
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <h2 className="font-serif text-lg text-[#1A1A1A]">{filtersTitle}</h2>

            <FilterCheckboxGroup title={materialTypeLabel} paramKey="type" options={typeOptions} />

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