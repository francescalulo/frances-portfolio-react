import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import { DESKTOP_QUERY } from "../../utilities/Utilities";
import "./ScrollCue.scss";

const EDGE = 8; // px of slack when checking for the bottom of the page
const IDLE_DELAY = 2000; // phones: hide this long (ms) after scrolling stops

const getSections = () => [...document.querySelectorAll("main section")];

// The section you're in is the last one whose top has passed the upper third of the
// screen; the next one is the one after it. (So at the very top, the hero counts as
// "current" even though it starts below the header.)
function getPosition() {
  const sections = getSections();
  const line = window.innerHeight / 3;
  let index = -1;

  sections.forEach((section, i) => {
    if (section.getBoundingClientRect().top <= line) index = i;
  });

  return {
    current: sections[index] ?? sections[0] ?? null,
    next: sections[index + 1] ?? null,
  };
}

const isAtPageEnd = () =>
  window.innerHeight + window.scrollY >=
  document.documentElement.scrollHeight - EDGE;

// Keyboard focus follows the scroll, so Tab carries on from the section you landed on
function focusSection(section) {
  if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
}

// Fixed "next section" control, on every page.
// Desktop + a section with rails: a mouse with a vertical "SCROLL" label sitting on the
// left rail (inspired by yasio.dev). Sections marked data-rails="false" (Featured Work)
// and all phones/tablets: a simple round arrow. At the last section it becomes
// "Back to top". It rides up above the footer so it never covers the footer links.
// Reduced motion: no wheel animation or fades, and the page jumps instead of gliding.
function ScrollCue() {
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isOnRails, setIsOnRails] = useState(true);
  const [footerOverlap, setFooterOverlap] = useState(0);
  const [isActive, setIsActive] = useState(false); // phones: only shown while scrolling
  const idleTimer = useRef(null);

  const update = useCallback(() => {
    const { next } = getPosition();
    setIsAtEnd(!next || isAtPageEnd());

    // The look depends on the section directly behind the cue (near the bottom of the
    // screen), not the one you're reading: rails behind it → mouse, no rails → arrow.
    const cueY = window.innerHeight - 72; // roughly the middle of the cue
    const behind = getSections().find((section) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= cueY && bottom > cueY;
    });
    setIsOnRails(behind ? behind.dataset.rails !== "false" : true); // footer has rails too

    const footer = document.querySelector("footer");
    const footerTop = footer
      ? footer.getBoundingClientRect().top
      : window.innerHeight;
    setFooterOverlap(Math.max(0, Math.round(window.innerHeight - footerTop)));
  }, []);

  useEffect(() => {
    let frame = null;

    // At most one update per frame while scrolling.
    // Any scroll also "wakes" the cue (phones), then it hides IDLE_DELAY after it stops.
    const onScroll = () => {
      setIsActive(true);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsActive(false), IDLE_DELAY);

      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer.current);
    };
  }, [pathname, update]);

  function handleClick() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = reduceMotion ? "auto" : "smooth";

    if (isAtEnd) {
      window.scrollTo({ top: 0, behavior });
      const first = getSections()[0];
      if (first) focusSection(first);
      return;
    }

    const { next } = getPosition();
    if (!next) return;
    next.scrollIntoView({ behavior });
    focusSection(next);
  }

  const variant = isDesktop && isOnRails ? "rail" : "arrow";

  return (
    <button
      type="button"
      className={`scroll-cue scroll-cue--${variant}${isAtEnd ? " scroll-cue--top" : ""}${!isDesktop && !isActive ? " scroll-cue--idle" : ""}`}
      style={{ "--footer-overlap": `${footerOverlap}px` }}
      aria-label={isAtEnd ? "Back to top" : "Scroll to next section"}
      onClick={handleClick}
    >
      {/* Rail version: mouse + vertical label */}
      <span className="scroll-cue__rail" aria-hidden="true">
        <svg
          className="scroll-cue__mouse"
          viewBox="0 0 16 26"
          focusable="false"
        >
          <rect
            className="scroll-cue__body"
            x="0.75"
            y="0.75"
            width="14.5"
            height="24.5"
            rx="7.25"
          />
          <circle className="scroll-cue__wheel" cx="8" cy="7" r="1.5" />
        </svg>
        <span className="scroll-cue__label">{isAtEnd ? "Top" : "Scroll"}</span>
      </span>

      {/* Arrow version: a thin arrow like yasio.dev, in the rail-marker purple */}
      <span className="scroll-cue__arrow" aria-hidden="true">
        <svg
          className="scroll-cue__arrow-icon"
          viewBox="0 0 16 32"
          focusable="false"
        >
          <path d="M8 1v29M2 24l6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}

export default ScrollCue;
