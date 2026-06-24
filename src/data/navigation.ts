export type NavItem =
  | { label: string; type: "anchor"; href: string }
  | { label: string; type: "route"; href: string };

export const navItems: NavItem[] = [
  { label: "nav.about", type: "anchor", href: "#about" },
  { label: "nav.services", type: "anchor", href: "#services" },
  { label: "nav.whyUs", type: "anchor", href: "#why-us" },
  { label: "nav.team", type: "route", href: "/team" },
  { label: "nav.contact", type: "anchor", href: "#contact" },
];
