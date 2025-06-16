import { Helmet } from "react-helmet-async";

function SEO({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Musdar.dev" />
    </Helmet>
  );
}

export default SEO;
