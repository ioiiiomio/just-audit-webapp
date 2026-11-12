// src/hooks/revalidate.ts
import { revalidatePath, revalidateTag } from "next/cache";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    GlobalAfterChangeHook,
    Payload,
} from "payload";

/**
 * Small corporate site → simplest correct strategy: purge the whole site cache.
 * "/" + "layout" = everything under the root layout, all locales, all pages.
 * The next visitor triggers a fresh render; everyone after gets the cached HTML.
 */
function revalidateSite(payload: Payload, reason: string) {
    payload.logger.info(`[revalidate] ${reason}`);
    revalidatePath("/", "layout");
    revalidateTag("education-materials");   // ← data cache used by seminars/videos
}

/** Skip when seeding/migrating (pass `context: { disableRevalidate: true }`) or saving a draft. */
function shouldSkip(context: Record<string, unknown>, doc?: { _status?: string }) {
    return Boolean(context?.disableRevalidate) || doc?._status === "draft";
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
                                                                     doc,
                                                                     collection,
                                                                     req: { payload, context },
                                                                 }) => {
    if (!shouldSkip(context, doc)) {
        revalidateSite(payload, `${collection.slug} changed: ${doc.id}`);
    }
    return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
                                                                     doc,
                                                                     collection,
                                                                     req: { payload, context },
                                                                 }) => {
    if (!shouldSkip(context)) {
        revalidateSite(payload, `${collection.slug} deleted: ${doc?.id}`);
    }
    return doc;
};

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({
                                                                       doc,
                                                                       global,
                                                                       req: { payload, context },
                                                                   }) => {
    if (!shouldSkip(context, doc)) {
        revalidateSite(payload, `global changed: ${global.slug}`);
    }
    return doc;
};