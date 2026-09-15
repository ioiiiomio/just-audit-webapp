import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email, materialTitle, files } = await req.json()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
        }

        const payload = await getPayload({ config: configPromise })

        const linksHtml = (files ?? [])
            .map((f: { label: string; url?: string }) =>
                f.url ? `<li><a href="${f.url}">${f.label}</a></li>` : `<li>${f.label}</li>`,
            )
            .join('')

        await payload.sendEmail({
            to: email,
            subject: `Материалы: ${materialTitle}`,
            html: `
        <p>Здравствуйте!</p>
        <p>Вы запросили материалы по теме «${materialTitle}» на justaudit.kz.</p>
        <ul>${linksHtml}</ul>
        <p>С уважением,<br/>JUST Audit</p>
      `,
        })

        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('send-materials error', err)
        return NextResponse.json({ error: 'server_error' }, { status: 500 })
    }
}