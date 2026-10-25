import { useState } from "react";
import "./ThemeToggle.scss";

const THEME_KEY = "fc-theme"; // index.html reads it too, to set the theme before the page draws

// Light mode on / off. Dark is the default. The choice is set as data-theme on <html>
// (which swaps the colour tokens, see _themes.scss) and saved for the next visit when the
// browser allows storage. aria-pressed tells screen readers whether light mode is on.
function ThemeToggle() {
  const [isLight, setIsLight] = useState(
    () => document.documentElement.dataset.theme === "light",
  );

  function toggle() {
    const theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    setIsLight(!isLight);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage blocked (private mode): the theme still changes for this visit
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isLight}
      onClick={toggle}
    >
      <span className="visually-hidden">Light mode</span>
      {/* Sun in dark mode (switch to light), moon in light mode (switch back) */}
      <svg
        className="theme-toggle__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        {isLight ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}

export default ThemeToggle;
