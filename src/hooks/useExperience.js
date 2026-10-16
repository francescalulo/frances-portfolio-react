import { useEffect, useState } from "react";
import { restBase } from "../utilities/Utilities";

// The career chapters (Experience CPT) in the WordPress "Order", with only the fields
// the About teaser uses.
const EXPERIENCE_URL =
  `${restBase}experience` +
  "?orderby=menu_order&order=asc&acf_format=standard&_fields=id,title,acf";

function useExperience() {
  const [chapters, setChapters] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true; // ignore the result if the component unmounts first

    fetch(EXPERIENCE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Experience request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (isActive) setChapters(data);
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

  return { chapters, isLoaded, hasError };
}

export default useExperience;
