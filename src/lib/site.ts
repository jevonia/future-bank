export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://newfuturebank.com";

/** Optional public address for the community coordinator. */
export const contactEmail =
  process.env.NEXT_PUBLIC_COMMUNITY_CONTACT_EMAIL?.trim() || null;
