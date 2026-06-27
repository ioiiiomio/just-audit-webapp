import { getPayload } from "payload";
import config from "@payload-config";
import { AnnouncementsBannerClient } from "./announcements-banner-client";

export async function AnnouncementsBanner({ locale }: { locale: string }) {
  const typedLocale = locale as "ru" | "kz";
  const payload = await getPayload({ config });
  const now = new Date().toISOString();

  const { docs } = await payload.find({
    collection: "announcements",
    locale: typedLocale,
    where: {
      isActive: { equals: true },
      and: [
        {
          or: [
            { startDate: { less_than_equal: now } },
            { startDate: { exists: false } },
          ],
        },
        {
          or: [
            { endDate: { greater_than_equal: now } },
            { endDate: { exists: false } },
          ],
        },
      ],
    },
    sort: "-priority",
    limit: 10,
  });

  if (docs.length === 0) return null;

  return <AnnouncementsBannerClient announcements={docs} />;
}
