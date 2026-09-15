import { FilterRadioGroup, ResetFiltersLink, type FilterOption } from './filter-primitives'

interface VideoFiltersSidebarProps {
    totalCount: number
    categories: FilterOption[]
    topics: FilterOption[]
    years: FilterOption[]
    categoriesTitle?: string
    allCategoriesLabel?: string
    topicsLabel?: string
    allTopicsLabel?: string
    yearLabel?: string
    allYearsLabel?: string
}

export function VideoFiltersSidebar({
                                        totalCount,
                                        categories,
                                        topics,
                                        years,
                                        categoriesTitle = 'Категории',
                                        allCategoriesLabel = 'Все категории',
                                        topicsLabel = 'Темы',
                                        allTopicsLabel = 'Все темы',
                                        yearLabel = 'Год',
                                        allYearsLabel = 'Все годы',
                                    }: VideoFiltersSidebarProps) {
    return (
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <h2 className="font-serif text-lg text-[#1A1A1A]">{categoriesTitle}</h2>
            <FilterRadioGroup
                title=""
                paramKey="category"
                allLabel={allCategoriesLabel}
                allCount={totalCount}
                options={categories}
            />
            <FilterRadioGroup
                title={topicsLabel}
                paramKey="topic"
                allLabel={allTopicsLabel}
                allCount={totalCount}
                options={topics}
            />
            <FilterRadioGroup
                title={yearLabel}
                paramKey="year"
                allLabel={allYearsLabel}
                allCount={totalCount}
                options={years}
            />

            <ResetFiltersLink />
        </aside>
    )
}