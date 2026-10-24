import { useEffect, useImperativeHandle, useRef } from "react";
import useGlitch from "../../hooks/useGlitch";
import useMediaQuery from "../../hooks/useMediaQuery";
import "./GlitchImage.scss";

const REST_TIME = 1200; // ms before the mouse can set it off again

// An image with an RGB-split glitch: pink and blue copies split off, jump sideways in
// slices, then snap back. Desktop: moving the mouse over it; touch screens: each time it
// scrolls into view; a parent can also set it off with ref.current.glitch() (About: on
// every Code / Decode switch; Home cards and Work archive rows: hovering). The copies
// are decoration only. Reduced motion: no glitch.
// imageProps go on every copy of the image (srcSet, sizes, loading…).
function GlitchImage({
  src,
  alt,
  width,
  height,
  className = "",
  imageProps = {},
  ref,
}) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { isGlitching, glitch } = useGlitch(REST_TIME);
  const wrapRef = useRef(null);

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
        {...imageProps}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="glitch__image"
      />
      <span className="glitch__layer glitch__layer--pink" aria-hidden="true">
        <img {...imageProps} src={src} alt="" className="glitch__image" />
      </span>
      <span className="glitch__layer glitch__layer--blue" aria-hidden="true">
        <img {...imageProps} src={src} alt="" className="glitch__image" />
      </span>
    </div>
  );
}

export default GlitchImage;
