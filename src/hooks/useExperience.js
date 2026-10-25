import useRestData from "./useRestData";
import { fetchJson, restBase } from "../utilities/Utilities";

// The career chapters (Experience CPT) in the WordPress "Order", with only the fields
// the About teaser uses.
const EXPERIENCE_URL =
  restBase +
  "experience?orderby=menu_order&order=asc&acf_format=standard&_fields=id,title,acf";

const loadExperience = () => fetchJson(EXPERIENCE_URL);

function useExperience() {
  const { data, isLoaded, hasError } = useRestData(loadExperience, []);
  return { chapters: data, isLoaded, hasError };
}

export default useExperience;
