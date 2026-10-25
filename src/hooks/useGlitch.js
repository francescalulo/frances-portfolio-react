import { useCallback, useEffect, useRef, useState } from "react";

const GLITCH_TIME = 450; // ms, the length of the glitch keyframes (global.scss)

// The RGB-split glitch, played once: isGlitching is true for one run of the keyframes.
// rest: ms after a run before glitch() can set it off again (glitch(true) skips the rest).
// A run is never restarted halfway: one tap fires several events (touch, mouse, focus).
// glitch() returns true if it started a run. Does nothing with reduced motion.
function useGlitch(rest = 0) {
  const [isGlitching, setIsGlitching] = useState(false);
  const lastRun = useRef(-Infinity);
  const timer = useRef(null);

  const glitch = useCallback(
    (force = false) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }

      const now = performance.now();
      const wait = force ? 0 : rest;
      if (now - lastRun.current < GLITCH_TIME + wait) return false;
      lastRun.current = now;

      setIsGlitching(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsGlitching(false), GLITCH_TIME);
      return true;
    },
    [rest],
  );

  // Clear the timer if the component unmounts mid-glitch
  useEffect(() => () => clearTimeout(timer.current), []);

  return { isGlitching, glitch };
}

export default useGlitch;
