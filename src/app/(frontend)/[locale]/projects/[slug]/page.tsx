import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Project } from '@/payload-types'
import { CmsLinkButton, HeadingRule, ProjectIcon } from '@/components/ui/project-ui'
import { GalleryCarousel } from '@/components/ui/gallery-carousel'

export const revalidate = 60

type Locale = 'ru' | 'kz' | 'en'
type Params = Promise<{ locale: Locale; slug: string }>

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://www.justaudit.kz'
const LOCALES: Locale[] = ['ru', 'kz', 'en']

// If your Payload localization uses a different code for Kazakh (e.g. 'kk'), map it here.
const toPayloadLocale = (locale: Locale) => locale

const getProject = cache(async (slug: string, locale: Locale): Promise<Project | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: toPayloadLocale(locale),
    fallbackLocale: 'ru',
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

const asMedia = (m: number | Media | null | undefined): Media | null =>
    m && typeof m === 'object' && m.url ? m : null

const paragraphs = (text?: string | null) =>
    (text ?? '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProject(slug, locale)
  if (!project) return {}

  const title = project.metaTitle || project.title
  const description = project.metaDescription || paragraphs(project.intro)[0]?.slice(0, 160)
  const image = asMedia(project.heroImage)

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/projects/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/projects/${slug}`])),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/projects/${slug}`,
      images: image?.url ? [{ url: image.url }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const project = await getProject(slug, locale)
  if (!project) notFound()

  const heroImage = asMedia(project.heroImage)
  const galleryImages = (project.gallery?.images ?? [])
      .map(asMedia)
      .filter((m): m is Media => !!m)
      .slice(0, 8)
      .map((m) => ({ id: m.id, url: m.url!, alt: m.alt ?? '' }))
  const joinImage = asMedia(project.joinCta?.image)
  const features = project.about?.features ?? []
  const values = project.values ?? []

  return (
      <main className="min-h-screen">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="container mx-auto grid gap-10 px-4 pb-16 pt-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            {project.eyebrow && (
                <p className="mb-4 text-sm uppercase tracking-wide text-primary/70">{project.eyebrow}</p>
            )}
            <h1 className="font-serif text-4xl font-bold leading-tight text-primary md:text-5xl">{project.title}</h1>
            <HeadingRule />
            <div className="mt-8 max-w-xl space-y-4 leading-relaxed text-foreground/80">
              {paragraphs(project.intro).map((p, i) => (
                  <p key={i}>{p}</p>
              ))}
            </div>
            <CmsLinkButton link={project.heroCta} className="mt-8" />
          </div>

          {heroImage && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                    src={heroImage.url!}
                    alt={heroImage.alt ?? project.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                />
              </div>
          )}
        </section>

        {/* ── What we do ───────────────────────────────────── */}
        {(project.about?.text || features.length > 0) && (
            <section className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-2 lg:gap-14">
              <div>
                {project.about?.heading && (
                    <h2 className="font-serif text-3xl font-bold text-primary">{project.about.heading}</h2>
                )}
                <HeadingRule />
                <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-foreground/80">
                  {paragraphs(project.about?.text).map((p, i) => (
                      <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {features.length > 0 && (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {features.map((f) => (
                        <li key={f.id} className="flex gap-4 rounded-xl border border-border/60 bg-card p-5">
                          <ProjectIcon name={f.icon} />
                          <div>
                            <h3 className="font-serif text-base font-semibold text-primary">{f.title}</h3>
                            {f.description && (
                                <p className="mt-1 text-sm leading-snug text-muted-foreground">{f.description}</p>
                            )}
                          </div>
                        </li>
                    ))}
                  </ul>
              )}
            </section>
        )}

        {/* ── Mission / beliefs / vision ───────────────────── */}
        {values.length > 0 && (
            <section className="container mx-auto grid gap-12 px-4 py-14 md:grid-cols-3">
              {values.map((v) => (
                  <div key={v.id}>
                    <ProjectIcon name={v.icon} size="lg" />
                    <h2 className="mt-6 font-serif text-2xl font-bold text-primary">{v.title}</h2>
                    <HeadingRule />
                    <p className="mt-6 leading-relaxed text-foreground/80">{v.text}</p>
                    <CmsLinkButton link={v.link} variant="text" className="mt-6" />
                  </div>
              ))}
            </section>
        )}

        {/* ── Gallery ──────────────────────────────────────── */}
        {galleryImages.length > 0 && (
            <section className="container mx-auto px-4 py-12">
              <div className="mb-12 flex flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
                <div className="hidden md:block" />
                {project.gallery?.heading && (
                    <h2 className="text-center font-serif text-3xl font-bold text-primary">
                      {project.gallery.heading}
                    </h2>
                )}
                <div className="md:justify-self-end">
                  <CmsLinkButton link={project.gallery?.moreLink} variant="text" />
                </div>
              </div>
              <GalleryCarousel images={galleryImages} />
            </section>
        )}

        {/* ── Join CTA ─────────────────────────────────────── */}
        {project.joinCta?.heading && (
            <section className="container mx-auto px-4 pb-16 pt-4">
              <div className="relative overflow-hidden rounded-2xl bg-primary/5">
                {joinImage && (
                    <>
                      <Image
                          src={joinImage.url!}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover object-right"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
                    </>
                )}
                <div className="relative max-w-xl px-8 py-10 md:px-10">
                  {project.joinCta.eyebrow && (
                      <p className="mb-2 text-xs uppercase tracking-wide text-primary/70">{project.joinCta.eyebrow}</p>
                  )}
                  <h2 className="font-serif text-3xl font-bold text-primary">{project.joinCta.heading}</h2>
                  {project.joinCta.subheading && (
                      <p className="mt-2 text-foreground/80">{project.joinCta.subheading}</p>
                  )}
                  <CmsLinkButton link={project.joinCta.button} className="mt-6" />
                </div>
              </div>
            </section>
        )}
      </main>
  )
}