'use client'

import { useState } from 'react'
import { Download, FileDown, Mail, Loader2, Check } from 'lucide-react'
import { formatFileSize } from '@/lib/education/format'

type DownloadFile = {
    id?: string | number
    label: string
    file?: { url?: string; filesize?: number }
}

export function MaterialDownloadsPanel({
                                           files,
                                           materialTitle,
                                           materialSlug,
                                       }: {
    files: DownloadFile[]
    materialTitle: string
    materialSlug: string
}) {
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const handleDownloadAll = () => {
        files.forEach((item, i) => {
            const url = item.file?.url
            if (!url) return
            setTimeout(() => {
                const a = document.createElement('a')
                a.href = url
                a.download = item.label
                a.target = '_blank'
                a.rel = 'noopener noreferrer'
                document.body.appendChild(a)
                a.click()
                a.remove()
            }, i * 400)
        })
    }

    const handleDownloadPdf = () => {
        window.print()
    }

    const handleSendEmail = async () => {
        const email = window.prompt('Введите email, на который отправить материалы:')
        if (!email) return

        setEmailStatus('sending')
        try {
            const res = await fetch('/api/education/send-materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    materialSlug,
                    materialTitle,
                    files: files.map((f) => ({ label: f.label, url: f.file?.url })),
                }),
            })
            if (!res.ok) throw new Error('failed')
            setEmailStatus('sent')
            setTimeout(() => setEmailStatus('idle'), 4000)
        } catch {
            setEmailStatus('error')
            setTimeout(() => setEmailStatus('idle'), 4000)
        }
    }

    return (
        <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
            <h2 className="mb-4 font-serif text-lg text-[#1A1A1A]">Материалы для скачивания</h2>
            <ul className="space-y-3">
                {files.map((item) => (
                    <li
                        key={item.id ?? item.label}
                        className="flex items-center justify-between gap-3 text-sm text-[#1A1A1A]/80"
                    >
            <span className="flex items-center gap-2.5">
              <Download className="h-4 w-4 shrink-0 text-[#155335]" strokeWidth={1.75} />
                {item.label}
            </span>
                        <span className="shrink-0 text-xs text-[#1A1A1A]/40">
              {formatFileSize(item.file?.filesize)}
            </span>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={handleDownloadAll}
                className="mt-5 w-full rounded-lg bg-[#155335] py-3 text-sm font-medium text-white hover:opacity-90"
            >
                Скачать все материалы
            </button>
            <button
                type="button"
                onClick={handleDownloadPdf}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#EDE9E3] py-3 text-sm text-[#1A1A1A] hover:border-[#155335]/30"
            >
                <FileDown className="h-4 w-4" /> Скачать PDF
            </button>
            <button
                type="button"
                onClick={handleSendEmail}
                disabled={emailStatus === 'sending'}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#EDE9E3] py-3 text-sm text-[#1A1A1A] hover:border-[#155335]/30 disabled:opacity-60"
            >
                {emailStatus === 'sending' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : emailStatus === 'sent' ? (
                    <Check className="h-4 w-4 text-[#155335]" />
                ) : (
                    <Mail className="h-4 w-4" />
                )}
                {emailStatus === 'sent'
                    ? 'Отправлено'
                    : emailStatus === 'error'
                        ? 'Ошибка, попробуйте снова'
                        : 'Отправить на email'}
            </button>
        </div>
    )
}