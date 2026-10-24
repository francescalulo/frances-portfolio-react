import { useEffect, useState } from "react";
import { fetchJson, restBase } from "../utilities/Utilities";

// One Work project by its slug (Work Detail), with its taxonomy terms embedded, the
// Yoast title/description for PageMeta and the next_project field for Next Up.
function projectUrl(slug) {
  return (
    restBase +
    "portfolio-project?slug=" +
    encodeURIComponent(slug) +
    "&acf_format=standard&_embed=wp:featuredmedia,wp:term" +
    "&_fields=id,slug,title,excerpt,acf,next_project,_links,_embedded" +
    ",yoast_head_json.title,yoast_head_json.description"
  );
}

function useWorkDetail(slug) {
  // The slug is saved with the result, so moving to another project shows the
  // Loader again until its own data arrives
  const [result, setResult] = useState({ slug: null });

  useEffect(() => {
    let isActive = true; // ignore the result if the page changes first

    fetchJson(projectUrl(slug))
      .then((data) => {
        // WordPress returns a list; an empty list means no project has this slug
        if (isActive) setResult({ slug, project: data[0] ?? null });
      })
      .catch(() => {
        if (isActive) setResult({ slug, hasError: true });
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const isLoaded = result.slug === slug;

  return {
    project: isLoaded ? (result.project ?? null) : null,
    isLoaded,
    hasError: isLoaded && Boolean(result.hasError),
  };
}

export default useWorkDetail;
