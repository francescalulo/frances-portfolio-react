import useRestData from "./useRestData";
import { fetchJson, restBase, shareRequest } from "../utilities/Utilities";

// Every Work project in the WordPress "Order" (Page Attributes → Order), with only the
// fields the cards use, plus the featured image and taxonomy terms embedded.
// _fields keeps the response small; _links + _embedded must stay in it for _embed to work.
const PROJECTS_URL =
  restBase +
  "portfolio-project?orderby=menu_order&order=asc&per_page=100&acf_format=standard" +
  "&_embed=wp:featuredmedia,wp:term" +
  "&_fields=id,slug,title,excerpt,date,acf,_links,_embedded";

// Home (Featured Work) and the Work archive share one request, so moving between the
// two pages never fetches the list twice
const loadProjects = shareRequest(() => fetchJson(PROJECTS_URL));

function useProjects() {
  const { data, isLoaded, hasError } = useRestData(loadProjects, []);
  return { projects: data, isLoaded, hasError };
}

export default useProjects;
