'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'

const MIN_MINUTES = 5
const MAX_MINUTES = 120 // top of the slider = "2+ часа" = no upper bound applied

interface DurationRangeFilterProps {
    title?: string
    minLabel?: string
    maxLabel?: string
}

export function DurationRangeFilter({
                                        title = 'Длительность',
                                        minLabel = `${MIN_MINUTES} мин`,
                                        maxLabel = '2+ часа',
                                    }: DurationRangeFilterProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialMin = Number(searchParams.get('durationMin')) || MIN_MINUTES
    const initialMax = Number(searchParams.get('durationMax')) || MAX_MINUTES
    const [range, setRange] = useState<[number, number]>([initialMin, initialMax])

    function commit(value: number[]) {
        const [min, max] = value
        const params = new URLSearchParams(searchParams.toString())
        if (min > MIN_MINUTES) params.set('durationMin', String(min))
        else params.delete('durationMin')
        if (max < MAX_MINUTES) params.set('durationMax', String(max))
        else params.delete('durationMax')
        params.delete('page')

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div>
            <h3 className="mb-4 font-serif text-base text-[#1A1A1A]">{title}</h3>
            <Slider
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                step={5}
                value={range}
                onValueChange={(value) => setRange(value as [number, number])}
                onValueCommit={commit}
                className="[&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#155335] [&_[role=slider]]:shadow-md [&>span:first-child]:bg-[#1A1A1A]/10 [&>span:first-child>span]:bg-[#155335]"
            />
            <div className="mt-2 flex justify-between text-xs text-[#1A1A1A]/50">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    )
}