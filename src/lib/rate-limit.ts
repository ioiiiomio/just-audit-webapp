// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstashConfig =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstashConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const rateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 min per IP
    })
  : null;

/**
 * Safe wrapper: fails OPEN if Upstash is unconfigured or unreachable,
 * so a Redis outage never blocks form submissions.
 */
export async function checkFormRateLimit(
  ip: string,
): Promise<{ success: boolean }> {
  if (!rateLimiter) {
    console.error("[rate-limit] Upstash not configured, allowing request");
    return { success: true };
  }

  try {
    const result = await rateLimiter.limit(ip);
    return { success: result.success };
  } catch (err) {
    console.error("[rate-limit] Upstash error, allowing request:", err);
    return { success: true };
  }
}
