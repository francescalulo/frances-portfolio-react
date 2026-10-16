import { useEffect, useState } from "react";
import { restBase } from "../utilities/Utilities";

// Every Work project in the WordPress "Order" (Page Attributes → Order), with only the
// fields the cards use, plus the featured image and taxonomy terms embedded.
// _fields keeps the response small; _links + _embedded must stay in it for _embed to work.
const PROJECTS_URL =
  `${restBase}portfolio-project` +
  "?orderby=menu_order&order=asc&per_page=100&acf_format=standard" +
  "&_embed=wp:featuredmedia,wp:term" +
  "&_fields=id,slug,title,excerpt,date,acf,_links,_embedded";

// Home (Featured Work) and the Work archive both need the projects. The first component
// that asks starts the request; every other one reuses the same promise, so moving
// between the two pages never fetches the list twice.
let projectsPromise = null;

function fetchProjects() {
  if (!projectsPromise) {
    projectsPromise = fetch(PROJECTS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Work request failed (${response.status})`);
        }
        return response.json();
      })
      .catch((error) => {
        projectsPromise = null; // allow a retry next time
        throw error;
      });
  }
  return projectsPromise;
}

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true; // ignore the result if the component unmounts first

    fetchProjects()
      .then((data) => {
        if (isActive) setProjects(data);
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

  return { projects, isLoaded, hasError };
}

export default useProjects;
