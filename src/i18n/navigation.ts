import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Re-exports locale-aware Link, redirect, usePathname, useRouter, getPathname
// built from your existing routing.ts config.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
