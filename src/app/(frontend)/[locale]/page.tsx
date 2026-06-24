import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale })

  const [services, team, certificates, settings] = await Promise.all([
    payload.find({ collection: 'services', locale, sort: 'order', limit: 50 }),
    payload.find({ collection: 'team-members', locale, sort: 'order', limit: 50 }),
    payload.find({ collection: 'certificates', locale, sort: 'order', limit: 50 }),
    payload.findGlobal({ slug: 'site-settings', locale }),
  ])

  return (
    <main>
      <section className="container py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-heading text-brand-green mb-4">
          {settings.heroTitle || 'Just Audit'}
        </h1>
        <p className="max-w-xl mx-auto text-brand-black/70 mb-8">{settings.heroSubtitle}</p>
        <a
          href="#contact"
          className="inline-block bg-brand-green text-white px-6 py-3 rounded-md font-label"
        >
          {t('hero.cta')}
        </a>
      </section>

      <section className="container py-16" id="services">
        <h2 className="text-3xl mb-8">{t('nav.services')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.docs.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl mb-2">{service.title}</h3>
              <p className="text-sm text-brand-black/70">{service.shortDescription}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16" id="team">
        <h2 className="text-3xl mb-8">{t('nav.team')}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {team.docs.map((member) => (
            <div key={member.id} className="text-center">
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-brand-black/60">{member.position}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16" id="certificates">
        <h2 className="text-3xl mb-8">Certificates</h2>
        <div className="flex gap-4 overflow-x-auto">
          {certificates.docs.map((cert) => (
            <div key={cert.id} className="min-w-[200px] bg-white rounded-lg p-4 shadow-sm">
              <p className="font-medium">{cert.title}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
