// The live React site (canonical links)
export const SITE_URL = "https://francescalulo.com";

export const restBase = "https://francescalulo.com/fc-cms-1212/wp-json/wp/v2/";

// Gets JSON from the WordPress REST API. A failed request (404, 500…) throws, so each
// hook can show its own error message.
export function fetchJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Request failed (" + response.status + "): " + url);
    }
    return response.json();
  });
}

// Wraps a request so it only runs once: every component that asks gets the same promise,
// so the page makes one request however many components need the data. A failed
// request can be tried again.
export function shareRequest(request) {
  let promise = null;
  return () => {
    if (!promise) {
      promise = request().catch((error) => {
        promise = null; // allow a retry next time
        throw error;
      });
    }
    return promise;
  };
}

// WordPress page IDs used by the app
export const SITE_SETTINGS_PAGE_ID = 41;
export const ABOUT_PAGE_ID = 52;

// Image sizes WordPress makes, smallest first (srcSet for featured images)
const MEDIA_SIZES = ["medium", "medium_large", "large", "full"];

// A post's or page's featured image, from ?_embed=wp:featuredmedia (null if it has none)
export function getFeaturedMedia(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

// srcSet for a featured image: one file per size WordPress made ("" if there are none)
export function mediaSrcSet(media) {
  const sizes = media?.media_details?.sizes ?? {};
  return MEDIA_SIZES.map((name) => sizes[name])
    .filter(Boolean)
    .map((size) => size.source_url + " " + size.width + "w")
    .join(", ");
}

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

// After an accordion opens: scrolls just enough to show the whole item. If it's taller
// than the screen, its top goes to the top instead, so the heading stays in view.
// Instant if the user prefers reduced motion.
export function revealInView(element) {
  if (!element) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isTooTall = element.getBoundingClientRect().height > window.innerHeight;

  element.scrollIntoView({
    block: isTooTall ? "start" : "nearest",
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

// Same as $breakpoint-desktop in _variables.scss (64em = 1024px). Keep the two in sync.
export const DESKTOP_QUERY = "(min-width: 64em)";

// Same as $breakpoint-tablet in _variables.scss (48em = 768px). Keep the two in sync.
export const TABLET_QUERY = "(min-width: 48em)";

// A project's terms for one taxonomy ("build", "work-category"…), from the ?_embed=wp:term data
export function getTerms(project, taxonomy) {
  return (project._embedded?.["wp:term"] ?? [])
    .flat()
    .filter((term) => term.taxonomy === taxonomy);
}

// Link types allowed from WordPress fields: web pages and email
const SAFE_PROTOCOLS = ["https:", "http:", "mailto:"];

// Returns the URL only if it's a web or email link, otherwise null, so a mistyped or
// harmful link from WordPress (e.g. "javascript:…" or "www.site.com") is never rendered.
export function safeUrl(url) {
  if (!url) return null;

  try {
    return SAFE_PROTOCOLS.includes(new URL(url).protocol) ? url : null;
  } catch {
    return null; // not a full URL
  }
}

// WordPress sends titles and term names with HTML entities (&amp;, &#8217;).
// This turns them into plain text, so React can show them safely as text.
export function decodeHtml(html = "") {
  return new DOMParser().parseFromString(html, "text/html").documentElement
    .textContent;
}

// Letters grouped by width in Space Grotesk, so a shuffled letter is swapped for one of
// about the same width and never spills over the letters next to it (an "m" over an "i" would)
const WIDTH_GROUPS = [
  "Iijl",
  "frt1",
  "EFLksvz7",
  "235689JPSTVYZacehnouxy",
  "04ABCDGHKNOQRUXbdgpq",
  "w",
  "MWm",
];

// The intro (Preloader): animations that should start after it (the hero) wait for
// whenIntroDone(); the Preloader calls finishIntro() when it ends or doesn't play.
let resolveIntro;
const introDone = new Promise((resolve) => {
  resolveIntro = resolve;
});
export const whenIntroDone = () => introDone;
export const finishIntro = () => resolveIntro();

// A random stand-in for char: same width group, from the text's own letters when it has
// some (pool is an array of letters), and the same case when possible
export function standIn(char, pool) {
  const group = WIDTH_GROUPS.find((letters) => letters.includes(char));
  if (!group) return char;

  const fromText = pool.filter((letter) => group.includes(letter));
  const candidates = fromText.length > 0 ? fromText : group.split("");
  const isUpper = char === char.toUpperCase();
  const sameCase = candidates.filter(
    (letter) => (letter === letter.toUpperCase()) === isUpper,
  );
  const options = sameCase.length > 0 ? sameCase : candidates;
  return options[Math.floor(Math.random() * options.length)];
}

// Shuffles the letters of text between from and to using the text's own letters
// (case and width matched), like the nav. Spaces and symbols stay put.
export function scrambleText(text, from, to) {
  const pool = text.replace(/[^a-z0-9]/gi, "").split("");
  return text
    .split("")
    .map((char, index) => {
      if (index < from || index >= to || !/[a-z0-9]/i.test(char)) return char;
      return standIn(char, pool);
    })
    .join("");
}

// Splits one line of code into coloured segments, like the rest of the site's code text:
// // comments blue, 'strings' pink, keywords yellow, names before ":" or "(" green.
// block is the CSS block the colour classes belong to, e.g. "key-takeaway" →
// "key-takeaway__comment", "key-takeaway__string", "key-takeaway__keyword", "key-takeaway__key"
const CODE_TOKEN =
  /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|\b(const|let|var|function|return|while|this|new|true|false|null)\b|([A-Za-z_$][\w$]*)(?=\s*[:(])/g;

const TOKEN_ROLES = ["comment", "string", "keyword", "key"];

export function toCodeSegments(line, block) {
  const segments = [];
  let last = 0;

  for (const match of line.matchAll(CODE_TOKEN)) {
    if (match.index > last) {
      segments.push({ text: line.slice(last, match.index) });
    }
    const role = TOKEN_ROLES[match.slice(1).findIndex(Boolean)];
    segments.push({ text: match[0], className: block + "__" + role });
    last = match.index + match[0].length;
  }

  if (last < line.length) segments.push({ text: line.slice(last) });
  return segments;
}

// Keeps a piece of code from wrapping in an odd place on small screens: short strings
// ("designer & developer") and hyphenated words (re-render) stay on one line
const SHORT_STRING = 28; // characters, quotes included
const HYPHENATED = /(\S*\w-\w\S*)/;

function keepTogether(segment, block) {
  const nowrap = block + "__nowrap";

  if (segment.className === block + "__string") {
    return segment.text.length <= SHORT_STRING
      ? [{ ...segment, className: segment.className + " " + nowrap }]
      : splitHyphenated(segment, nowrap);
  }
  return splitHyphenated(segment, nowrap);
}

function splitHyphenated(segment, nowrap) {
  return segment.text
    .split(HYPHENATED)
    .filter(Boolean)
    .map((text) => ({
      text,
      className: HYPHENATED.test(text)
        ? (segment.className ? segment.className + " " : "") + nowrap
        : segment.className,
    }));
}

// Turns code written as an array of strings into DecodeText / CodeToggle lines.
// Two leading spaces = one indent step (block__indent-1, -2…); an empty string is an
// empty line, like in an editor. "()" gets a space, like "( )" in the hero.
// Colours come from toCodeSegments; block__nowrap marks the bits that must not wrap.
export function toCodeLines(code, block) {
  const lines = [];

  code.forEach((line) => {
    // An empty line keeps its height (and its line number) with a non-breaking space
    if (!line.trim()) {
      lines.push({
        className: block + "__code",
        segments: [{ text: "\u00A0" }],
      });
      return;
    }

    const indent = (line.length - line.trimStart().length) / 2;
    const text = line.trim().replaceAll("()", "(\u00A0)");
    lines.push({
      className:
        block +
        "__code" +
        (indent > 0 ? " " + block + "__indent-" + indent : ""),
      segments: toCodeSegments(text, block).flatMap((segment) =>
        keepTogether(segment, block),
      ),
    });
  });

  return lines;
}
