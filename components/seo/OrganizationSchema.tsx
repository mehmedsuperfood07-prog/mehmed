import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { SocialLinks } from "@/lib/social";

export function OrganizationSchema({
  logoUrl,
  phone,
  email,
  address,
  socialLinks,
}: {
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  socialLinks?: SocialLinks | null;
}) {
  const sameAs = Object.values(socialLinks ?? {}).filter(
    (url): url is string => Boolean(url),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    ...(logoUrl && { logo: logoUrl }),
    // Plain string, not a structured PostalAddress -- the DB only stores
    // one free-text address field (no separate street/city/region), and
    // schema.org allows `address` as a string for exactly this case.
    ...(address && { address }),
    ...((phone || email) && {
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        ...(phone && { telephone: phone }),
        ...(email && { email }),
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  // Static, server-built JSON -- not user input.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
