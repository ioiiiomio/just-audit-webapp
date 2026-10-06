import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Eye,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  Star,
  Target,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  video: Video,
  users: Users,
  book: BookOpen,
  star: Star,
  target: Target,
  eye: Eye,
  heart: Heart,
  lightbulb: Lightbulb,
  handshake: Handshake,
  graduation: GraduationCap,
}

export function ProjectIcon({ name, size = 'md' }: { name?: string | null; size?: 'md' | 'lg' }) {
  const Icon = ICONS[name ?? ''] ?? Star
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary',
        size === 'lg' ? 'h-14 w-14' : 'h-11 w-11',
      )}
      aria-hidden
    >
      <Icon className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.75} />
    </span>
  )
}

export type CmsLink = {
  label?: string | null
  url?: string | null
  newTab?: boolean | null
} | null | undefined

/** Renders nothing if the editor left the url empty for this language. */
export function CmsLinkButton({
  link,
  variant = 'solid',
  className,
}: {
  link: CmsLink
  variant?: 'solid' | 'text'
  className?: string
}) {
  if (!link?.url || !link.label) return null

  const isInternal = link.url.startsWith('/') || link.url.startsWith('#')
  const classes = cn(
    'inline-flex items-center gap-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    variant === 'solid'
      ? 'rounded-lg bg-primary px-7 py-3.5 text-primary-foreground hover:bg-primary/90'
      : 'text-primary hover:underline underline-offset-4',
    className,
  )
  const content = (
    <>
      {link.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  )
  const targetProps = link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return isInternal && !link.newTab ? (
    <Link href={link.url} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={link.url} className={classes} {...targetProps}>
      {content}
    </a>
  )
}

/** Short green underline used under every heading in the design */
export function HeadingRule() {
  return <span className="mt-4 block h-[3px] w-12 rounded-full bg-primary" aria-hidden />
}
