import useRestData from "./useRestData";
import {
  fetchJson,
  restBase,
  safeUrl,
  shareRequest,
  SITE_SETTINGS_PAGE_ID,
} from "../utilities/Utilities";

// The Site Settings page's ACF fields (email, CTA text, location, social links)
const SETTINGS_URL =
  restBase +
  "pages/" +
  SITE_SETTINGS_PAGE_ID +
  "?acf_format=standard&_fields=acf";

// The header menu, Footer, Contact and Quick Info all need it: one shared request
const loadSiteSettings = shareRequest(() =>
  fetchJson(SETTINGS_URL).then((data) => data.acf),
);

function useSiteSettings() {
  const {
    data: settings,
    isLoaded,
    hasError,
  } = useRestData(loadSiteSettings, null);

  // Social links with a safe URL only (ACF returns false when the repeater is empty)
  const socialLinks = (settings?.social_links || []).filter((link) =>
    safeUrl(link.url),
  );

  return { settings, socialLinks, isLoaded, hasError };
}

export default useSiteSettings;
