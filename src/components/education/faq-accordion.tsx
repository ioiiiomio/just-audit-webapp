'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FaqAccordion({ items }: { items: { question: string; answer: string; id?: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-[#EDE9E3] rounded-2xl border border-[#EDE9E3] bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.id ?? item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="text-sm text-[#1A1A1A]">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#1A1A1A]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen ? (
              <div className="px-6 pb-4 text-sm leading-relaxed text-[#1A1A1A]/70">{item.answer}</div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
