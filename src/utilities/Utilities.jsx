export const restBase = "https://francescalulo.com/fc-cms-1212/wp-json/wp/v2/";

// WordPress page IDs used by the app
export const SITE_SETTINGS_PAGE_ID = 41;
export const ABOUT_PAGE_ID = 52;

// ACF social_links platform value → display label (Footer, QuickInfo)
export const PLATFORM_LABELS = {
  linkedin: "LinkedIn",
  github: "GitHub",
};

// Scrolls to a section and moves keyboard focus there (instant if the user prefers reduced motion).
// The target needs tabIndex={-1}. Returns false if the section isn't on this page.
export function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return false;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  section.focus({ preventScroll: true });
  return true;
}

// Same as $breakpoint-desktop in _variables.scss (64em = 1024px). Keep the two in sync.
export const DESKTOP_QUERY = "(min-width: 64em)";

// Same as $breakpoint-tablet in _variables.scss (48em = 768px). Keep the two in sync.
export const TABLET_QUERY = "(min-width: 48em)";
