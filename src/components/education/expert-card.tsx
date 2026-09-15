import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { getLucideIcon } from '@/lib/education/get-lucide-icon'
import type { EducationExpert } from '@/lib/education/types'

export function ExpertCard({ expert, title = 'Эксперт' }: { expert: EducationExpert; title?: string }) {
  return (
    <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
      <h3 className="mb-5 font-serif text-lg text-[#1A1A1A]">{title}</h3>

      <div className="flex items-start gap-4">
        {expert.photo?.url ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EDE9E3]">
            <Image src={expert.photo.url} alt={expert.name} fill className="object-cover" />
          </div>
        ) : null}
        <div>
          <p className="font-serif text-base text-[#1A1A1A]">{expert.name}</p>
          {expert.role ? <p className="text-sm text-[#1A1A1A]/60">{expert.role}</p> : null}
        </div>
      </div>

      {expert.bulletPoints?.length ? (
        <ul className="mt-5 space-y-3">
          {expert.bulletPoints.map((point) => {
            const Icon = point.icon ? getLucideIcon(point.icon) : CheckCircle2
            return (
              <li
                key={point.id ?? point.label}
                className="flex items-start gap-3 text-sm leading-relaxed text-[#1A1A1A]/70"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#155335]" strokeWidth={1.75} />
                {point.label}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
