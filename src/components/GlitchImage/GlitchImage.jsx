import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import "./GlitchImage.scss";

const GLITCH_TIME = 450; // ms, the length of the CSS animation
const REST_TIME = 1200; // ms before the mouse can set it off again

// An image with an RGB-split glitch: pink and blue copies split off, jump sideways in
// slices, then snap back. Desktop: moving the mouse over it; touch screens: each time it
// scrolls into view; a parent can also set it off with ref.current.glitch() (About: on
// every Code / Decode switch). The copies are decoration only. Reduced motion: no glitch.
function GlitchImage({ src, alt, width, height, className = "", ref }) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [isGlitching, setIsGlitching] = useState(false);
  const wrapRef = useRef(null);
  const lastRun = useRef(-Infinity);
  const timer = useRef(null);

  // force: a parent asked for it (skips the rest time the mouse has to wait)
  const glitch = useCallback((force = false) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const now = performance.now();
    if (!force && now - lastRun.current < GLITCH_TIME + REST_TIME) return;
    lastRun.current = now;

    setIsGlitching(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsGlitching(false), GLITCH_TIME);
  }, []);

  useImperativeHandle(ref, () => ({ glitch: () => glitch(true) }), [glitch]);

  // Touch screens: glitch each time at least half of the image scrolls into view
  useEffect(() => {
    if (canHover || !wrapRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) glitch();
      },
      { threshold: 0.5 },
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [canHover, glitch]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      ref={wrapRef}
      className={
        "glitch" +
        (isGlitching ? " is-glitching" : "") +
        (className ? " " + className : "")
      }
      onMouseMove={canHover ? () => glitch() : undefined}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="glitch__image"
      />
      <span className="glitch__layer glitch__layer--pink" aria-hidden="true">
        <img src={src} alt="" className="glitch__image" />
      </span>
      <span className="glitch__layer glitch__layer--blue" aria-hidden="true">
        <img src={src} alt="" className="glitch__image" />
      </span>
    </div>
  );
}

export default GlitchImage;
