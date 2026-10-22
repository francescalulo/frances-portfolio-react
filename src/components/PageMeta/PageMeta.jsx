import { useLocation } from "react-router-dom";
import { SITE_URL } from "../../utilities/Utilities";

// A page's <title>, meta description and canonical link. React moves them into <head>
// and swaps them when the page changes. noIndex (404) keeps the page out of search
// results instead of giving it a canonical link. Share (og:) tags live in index.html,
// because social sites don't run JavaScript.
function PageMeta({ title, description, noIndex = false }) {
  const { pathname } = useLocation();

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noIndex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={SITE_URL + pathname} />
      )}
    </>
  );
}

export default PageMeta;
