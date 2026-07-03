import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/routing"; // adjust import if your locale type lives elsewhere

export async function getNavItems(locale: Locale) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "nav-items",
    locale,
    sort: "order",
    limit: 50,
    where: { showInNavbar: { equals: true } },
  });
  return result.docs;
}

export async function getFooterNavItems(locale: Locale) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "nav-items",
    locale,
    sort: "order",
    limit: 50,
    where: { showInFooter: { equals: true } },
  });
  return result.docs;
}

export async function getFooterServices(locale: Locale) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "services",
    locale,
    sort: "order",
    limit: 6,
  });
  return result.docs;
}

export async function getSiteSettings(locale: Locale) {
  const payload = await getPayload({ config });
  // globals use findGlobal, not find/findByID — per your earlier gotcha
  return payload.findGlobal({
    slug: "site-settings",
    locale,
  });
}
