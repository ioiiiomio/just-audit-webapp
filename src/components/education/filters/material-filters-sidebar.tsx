import { FilterCheckboxGroup, FilterRadioGroup, ResetFiltersLink, type FilterOption } from './filter-primitives'

interface MaterialFiltersSidebarProps {
    totalCount: number
    materialTypes: FilterOption[]
    topics: FilterOption[]
}

export function MaterialFiltersSidebar({
                                           totalCount,
                                           materialTypes,
                                           topics,
                                       }: MaterialFiltersSidebarProps) {
    return (
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <h2 className="font-serif text-lg text-[#1A1A1A]">Фильтры</h2>

            <FilterCheckboxGroup title="Тип материала" paramKey="type" options={materialTypes} />
            <FilterRadioGroup title="Темы" paramKey="topic" allLabel="Все темы" allCount={totalCount} options={topics} />

            <ResetFiltersLink />
        </aside>
    )
}