// Mirrors your existing Services icon-resolution pattern: free-text PascalCase
// icon names from the CMS, resolved at runtime with a HelpCircle fallback.
// If you already have this helper elsewhere (e.g. src/lib/getLucideIcon.ts),
// delete this file and import that one instead.
import * as LucideIcons from 'lucide-react'
import { HelpCircle, type LucideIcon } from 'lucide-react'

export function getLucideIcon(name?: string | null): LucideIcon {
  if (!name) return HelpCircle
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  return Icon ?? HelpCircle
}
