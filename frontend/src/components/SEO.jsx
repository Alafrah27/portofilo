import { Helmet } from "react-helmet-async";

function SEO({ title, description, keywords, image, url }) {
  const siteUrl = url || "https://musdar.dev";
  const defaultImage = image || "https://musdar.dev/musdar-logo.png"; // Replace with your actual OG image URL
  const siteName = "Musdar.dev";

  // JSON-LD Structured Data for a Local Business / Software Company
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication", // or "ProfessionalService" / "Organization"
    "name": siteName,
    "url": siteUrl,
    "logo": defaultImage,
    "description": description,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-55-547-5591",
      "contactType": "customer service",
      "email": "almusdarthafa@gmail.com",
      "availableLanguage": ["English", "Arabic"]
    },
    "sameAs": [
      // Add your social links here when ready
      "https://github.com/musdar",
      "https://linkedin.com/company/musdar"
    ]
  };

  return (
    <Helmet>
      {/* Basic Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical Link */}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* Structured Data (JSON-LD) for Google */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default SEO;
