import useRestData from "./useRestData";
import { ABOUT_PAGE_ID, fetchJson, restBase } from "../utilities/Utilities";

// The About page's ACF fields (Core Competencies, FAQs), its Yoast description and its
// featured image (the portrait). _links + _embedded must stay in _fields for _embed to work.
const ABOUT_URL =
  restBase +
  "pages/" +
  ABOUT_PAGE_ID +
  "?acf_format=standard&_embed=wp:featuredmedia" +
  "&_fields=acf,yoast_head_json.description,_links,_embedded";

const loadAbout = () => fetchJson(ABOUT_URL);

function useAboutPage() {
  const { data, isLoaded, hasError } = useRestData(loadAbout, null);
  return { about: data, isLoaded, hasError };
}

export default useAboutPage;
