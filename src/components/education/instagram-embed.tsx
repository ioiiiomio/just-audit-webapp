// components/education/instagram-embed.tsx
'use client'

import { useEffect, useRef } from 'react'

declare global {
    interface Window {
        instgrm?: { Embeds: { process: () => void } }
    }
}

export function InstagramEmbed({ url }: { url: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const scriptId = 'instagram-embed-script'
        const process = () => window.instgrm?.Embeds.process()

        if (window.instgrm) {
            process()
        } else if (!document.getElementById(scriptId)) {
            const script = document.createElement('script')
            script.id = scriptId
            script.src = 'https://www.instagram.com/embed.js'
            script.async = true
            script.onload = process
            document.body.appendChild(script)
        }
    }, [url])

    return (
        <div ref={ref} className="mx-auto max-w-[420px]">
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{ margin: 0, width: '100%' }}
            />
        </div>
    )
}