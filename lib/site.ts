// Canonical production origin -- deliberately a hardcoded constant, not an
// env var. Canonical/OG URLs must point to the same authority from every
// environment (prod, preview, local), so a per-deployment env value would
// be the wrong lever here. Must be the `www` host, not the bare apex: the
// domain went live with Vercel's project set up so the apex 308-redirects
// to www (confirmed via curl) -- pointing this at the apex would make
// every canonical tag resolve through a redirect instead of actually
// self-referencing. Do not point this at mehmed.vercel.app.
export const SITE_URL = "https://www.mehmedsuperfood.pk";
export const SITE_NAME = "Mehmed Super Foods";
