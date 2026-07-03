import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/routing"; // adjust import if your locale type lives elsewhere
import type { Service } from "@/payload-types"; // adjust path if your generated types live elsewhere

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

export async function getFooterSettings(locale: Locale) {
  const payload = await getPayload({ config });
  // globals use findGlobal, not find/findByID — per your earlier gotcha
  const footer = await payload.findGlobal({
    slug: "footer",
    locale,
    depth: 1, // resolves the `services` relationship field into full Service docs
  });

  // `services` is an array of { service: Service | number, id: string }.
  // On Postgres, an UNPOPULATED relationship comes back as a numeric id,
  // not a string — so we narrow on `typeof === "object"` rather than
  // excluding "string". This also defensively drops any relationship left
  // pointing at a deleted Service (which resolves to null/undefined).
  const services = (footer.services ?? [])
    .map((item) => item.service)
    .filter(
      (service): service is Service =>
        Boolean(service) && typeof service === "object",
    );

  return {
    description: footer.description,
    services,
  };
}
