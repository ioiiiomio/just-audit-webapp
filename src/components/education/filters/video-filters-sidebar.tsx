import { FilterRadioGroup, ResetFiltersLink, type FilterOption } from './filter-primitives'

interface VideoFiltersSidebarProps {
    totalCount: number
    categories: FilterOption[]
    topics: FilterOption[]
    years: FilterOption[]
}

export function VideoFiltersSidebar({
                                        totalCount,
                                        categories,
                                        topics,
                                        years,
                                    }: VideoFiltersSidebarProps) {
    return (
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <h2 className="font-serif text-lg text-[#1A1A1A]">Категории</h2>
            <FilterRadioGroup
                title=""
                paramKey="category"
                allLabel="Все категории"
                allCount={totalCount}
                options={categories}
            />
            <FilterRadioGroup title="Темы" paramKey="topic" allLabel="Все темы" allCount={totalCount} options={topics} />
            <FilterRadioGroup title="Год" paramKey="year" allLabel="Все годы" allCount={totalCount} options={years} />

            <ResetFiltersLink />
        </aside>
    )
}