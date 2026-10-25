import useRestData from "./useRestData";
import { ABOUT_PAGE_ID, fetchJson, restBase } from "../utilities/Utilities";

// The About page's ACF fields (Core Competencies, FAQs) and its Yoast description
const ABOUT_URL =
  restBase +
  "pages/" +
  ABOUT_PAGE_ID +
  "?acf_format=standard&_fields=acf,yoast_head_json.description";

const loadAbout = () => fetchJson(ABOUT_URL);

function useAboutPage() {
  const { data, isLoaded, hasError } = useRestData(loadAbout, null);
  return { about: data, isLoaded, hasError };
}

export default useAboutPage;
