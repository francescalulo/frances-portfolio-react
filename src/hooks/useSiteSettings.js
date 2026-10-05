import { useEffect, useState } from "react";
import { restBase, SITE_SETTINGS_PAGE_ID } from "../utilities/Utilities";

// Footer and ContactCTA both need Site Settings. The first component that asks
// starts the fetch; every other component reuses the same promise, so the
// page only makes ONE request no matter how many components use this hook.
let settingsPromise = null;

function fetchSiteSettings() {
  if (!settingsPromise) {
    settingsPromise = fetch(
      `${restBase}pages/${SITE_SETTINGS_PAGE_ID}?acf_format=standard&_fields=acf`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Site Settings request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => data.acf)
      .catch((error) => {
        settingsPromise = null; // allow a retry next time
        throw error;
      });
  }
  return settingsPromise;
}

function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true; // ignore the result if the component unmounts first

    fetchSiteSettings()
      .then((acf) => {
        if (isActive) setSettings(acf);
      })
      .catch((err) => {
        if (isActive) setError(err);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { settings, error, isLoaded: settings !== null };
}

export default useSiteSettings;
