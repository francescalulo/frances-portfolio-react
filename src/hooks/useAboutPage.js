import { useEffect, useState } from "react";
import { ABOUT_PAGE_ID, restBase } from "../utilities/Utilities";

// The About page's ACF fields (Core Competencies, FAQs) and its Yoast description
const ABOUT_URL =
  `${restBase}pages/${ABOUT_PAGE_ID}` +
  "?acf_format=standard&_fields=acf,yoast_head_json.description";

function useAboutPage() {
  const [about, setAbout] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true; // ignore the result if the component unmounts first

    fetch(ABOUT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`About request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (isActive) setAbout(data);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { about, isLoaded, hasError };
}

export default useAboutPage;
