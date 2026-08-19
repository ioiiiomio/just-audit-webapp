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

export async function getFooterSettings(locale: Locale): Promise<{
  description: string | null | undefined;
  services: Service[];
}> {
  const payload = await getPayload({ config });

  const footer = await payload.findGlobal({
    slug: "footer",
    locale,
    depth: 1,
  });

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

export async function getContactDetails(locale: Locale) {
  const payload = await getPayload({ config });
  // "contact-details" is a collection, not a global — payload.find(), not findGlobal()
  const result = await payload.find({
    collection: "contact-details",
    locale,
    sort: "order",
    limit: 100,
  });
  return result.docs;
}
