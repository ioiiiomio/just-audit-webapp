import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  Folder,
  Calendar,
  FileType,
} from 'lucide-react'
import { ExpertCard } from '@/components/education/expert-card'
import { EducationCard } from '@/components/education/education-card'
import { NewsletterCTA } from '@/components/education/newsletter-cta'
import { FaqAccordion } from '@/components/education/faq-accordion'
import { MaterialDownloadsPanel } from '@/components/education/material-downloads-panel'
import { formatDate, extractHeadings } from '@/lib/education/format'
import type { EducationMaterial } from '@/lib/education/types'

export default async function SeminarDetailPage({
                                                  params,
                                                }: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'knowledge' })
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'education-materials',
    locale: locale,
    where: { and: [{ slug: { equals: slug } }, { contentType: { equals: 'article' } }] },
    limit: 1,
    depth: 2,
  })

  const material = result.docs[0] as EducationMaterial | undefined
  if (!material) notFound()

  const relatedResult = await payload.find({
    collection: 'education-materials',
    locale: locale,
    where: {
      and: [{ contentType: { equals: 'article' } }, { id: { not_equals: material.id } }],
    },
    sort: '-publishedDate',
    limit: 3,
    depth: 1,
  })

  const headings = extractHeadings(material.content)

  return (
      <div className="bg-[#F7F5F2]">
        <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#1A1A1A]/50">
            <Link href="/">{t('home')}</Link>
            <span>/</span>
            <Link href="/knowledge">{t('breadcrumb')}</Link>
            <span>/</span>
            <span className="text-[#1A1A1A]">{t('seminarDetail.breadcrumb')}</span>
          </nav>
        </div>

        <section className="mx-auto max-w-6xl px-6 pb-10 pt-6 lg:px-16">
        <span className="mb-4 inline-block rounded-full bg-white px-3 py-1 text-xs text-[#1A1A1A]/60">
          {t('seminarDetail.badge')}
        </span>
          <h1 className="font-serif text-4xl leading-tight text-[#1A1A1A] md:text-[2.75rem]">{material.title}</h1>
          {material.excerpt ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1A1A1A]/60">{material.excerpt}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#1A1A1A]/70">
            {material.category ? (
                <span className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-[#155335]" strokeWidth={1.75} /> {material.category.name}
            </span>
            ) : null}
            {material.publishedDate ? (
                <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#155335]" strokeWidth={1.75} />
                  {formatDate(material.publishedDate, locale)}
            </span>
            ) : null}
            <span className="flex items-center gap-2">
            <FileType className="h-4 w-4 text-[#155335]" strokeWidth={1.75} /> {t('seminarDetail.formatTextFiles')}
          </span>
          </div>
        </section>

        <section className="mx-auto max-w-6xl gap-10 px-6 pb-16 lg:flex lg:px-16">
          {/* Main content */}
          <article className="flex-1 space-y-8">
            <div className="rounded-2xl border border-[#EDE9E3] bg-white p-8">
              <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-[#1A1A1A] prose-p:text-[#1A1A1A]/75 prose-li:text-[#1A1A1A]/75">
                <RichText data={material.content} />
              </div>
            </div>

            {material.faq?.length ? (
                <div>
                  <h2 className="mb-4 font-serif text-2xl text-[#1A1A1A]">FAQ</h2>
                  <FaqAccordion items={material.faq} />
                </div>
            ) : null}

            <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-lg text-[#1A1A1A]">
                {t('seminarDetail.consultationTitle')}
                <span className="mt-1 block text-sm font-sans font-normal text-[#1A1A1A]/60">
                {t('seminarDetail.consultationSubtitle')}
              </span>
              </p>
              <Link
                  href="/contact"
                  className="shrink-0 rounded-lg bg-[#155335] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
              >
                {t('seminarDetail.consultationCta')}
              </Link>
            </div>

            {relatedResult.docs.length ? (
                <div>
                  <h2 className="mb-4 font-serif text-2xl text-[#1A1A1A]">{t('seminarDetail.relatedTitle')}</h2>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {(relatedResult.docs as EducationMaterial[]).map((related) => (
                        <EducationCard key={related.id} material={related} locale={locale} />
                    ))}
                  </div>
                </div>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="mt-8 w-full shrink-0 space-y-6 lg:mt-0 lg:w-80">
            {material.expert ? <ExpertCard expert={material.expert} title={t('seminarDetail.expertTitle')} /> : null}

            {headings.length ? (
                <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
                  <h2 className="mb-4 font-serif text-lg text-[#1A1A1A]">{t('seminarDetail.contentsTitle')}</h2>
                  <ol className="space-y-2.5 text-sm text-[#1A1A1A]/70">
                    {headings.map((heading, i) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="hover:text-[#155335]">
                            {i + 1}. {heading.text}
                          </a>
                        </li>
                    ))}
                    {material.faq?.length ? <li className="text-[#1A1A1A]/70">{headings.length + 1}. FAQ</li> : null}
                  </ol>
                </div>
            ) : null}

            {material.downloadFiles?.length ? (
                <MaterialDownloadsPanel
                    files={material.downloadFiles}
                    materialTitle={material.title}
                    materialSlug={material.slug}
                    title={t('seminarDetail.downloads.title')}
                    downloadAllLabel={t('seminarDetail.downloads.downloadAll')}
                    downloadPdfLabel={t('seminarDetail.downloads.downloadPdf')}
                    emailPromptText={t('seminarDetail.downloads.emailPrompt')}
                    sendEmailLabel={t('seminarDetail.downloads.sendEmail')}
                    sentLabel={t('seminarDetail.downloads.sent')}
                    errorLabel={t('seminarDetail.downloads.error')}
                />
            ) : null}
          </aside>
        </section>

        {/*<section className="mx-auto max-w-6xl px-6 pb-20 lg:px-16">*/}
        {/*  <NewsletterCTA />*/}
        {/*</section>*/}
      </div>
  )
}