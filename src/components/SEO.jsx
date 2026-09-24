import { Helmet } from "react-helmet-async";

/**
 * SEO component — injects into <head> on every page.
 *
 * Props:
 *   title       — page-specific title (appended with site name)
 *   description — meta description (max 160 chars)
 *   canonical   — canonical URL for this page
 *   image       — OG / Twitter card image URL
 *   noIndex     — if true, sets robots noindex
 *   jsonLd      — single structured data object OR array of them
 */
export default function SEO({ title, description, canonical, image, noIndex = false, jsonLd }) {
  const SITE_NAME = "Sofa Hi Sofa.Com";
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";
  const DEFAULT_DESC = "Shop handcrafted luxury sofas, recliners, beds & dining sets direct from factory. 10-Year Frame Warranty, 200+ custom fabrics & Free Delivery in All Over India.";

  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Buy Premium Sofas Online India`;
  const metaDesc = description || DEFAULT_DESC;
  const ogImage = image || DEFAULT_IMAGE;

  // Support both a single jsonLd object and an array of them
  const jsonLdArray = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : [];

  return (
    <Helmet>
      {/* ─── Core ─────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }

      {/* ─── Open Graph ───────────────────────────────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* ─── Twitter Card ─────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* ─── JSON-LD Structured Data (one <script> per schema) ── */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
