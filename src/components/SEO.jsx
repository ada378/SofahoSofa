import { Helmet } from "react-helmet-async";

// Every page renders <SEO /> once with page-specific data.
// This is what makes the React SPA "SEO friendly" once server-rendered
// or pre-rendered (see docs/SEO_GUIDE.md for the full strategy).
export default function SEO({ title, description, canonical, image, jsonLd }) {
  const siteTitle = "Sofa Hi Sofa.Com";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Buy Premium Sofas Online`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
