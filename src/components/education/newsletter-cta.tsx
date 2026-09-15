'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/education-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="flex flex-col items-start gap-6 rounded-2xl border border-[#EDE9E3] bg-white p-8 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE9E3] text-[#155335]">
          <BookOpen className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div>
          <p className="font-serif text-lg text-[#1A1A1A]">Хотите быть в курсе новых материалов?</p>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">
            Подпишитесь и получайте уведомления о новых лекциях, семинарах и видео.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full shrink-0 gap-3 md:w-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите ваш e-mail"
          className="w-full min-w-0 rounded-lg border border-[#EDE9E3] bg-[#F7F5F2] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#155335] focus:outline-none md:w-64"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="shrink-0 rounded-lg bg-[#155335] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'done' ? 'Готово' : 'Подписаться'}
        </button>
      </form>
    </div>
  )
}
