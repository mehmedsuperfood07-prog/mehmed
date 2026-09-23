// Canonical production origin -- deliberately a hardcoded constant, not an
// env var. Canonical/OG URLs must point to the same authority from every
// environment (prod, preview, local), so a per-deployment env value would
// be the wrong lever here. mehmedsuperfood.pk is the intended domain per
// CLAUDE.md even before its DNS cutover is complete (see that file's
// "Deployment status" section) -- do not point this at mehmed.vercel.app.
export const SITE_URL = "https://mehmedsuperfood.pk";
export const SITE_NAME = "Mehmed Super Foods";
