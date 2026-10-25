import { useCallback, useEffect, useRef, useState } from "react";
import { scrambleText } from "../utilities/Utilities";

// Scrambles a small band of letters that sweeps left to right across `text`,
// using the text's own letters (case and width matched) so it feels like the word
// rearranging itself. Brackets, slashes and spaces stay fixed.
// isScrambling is true while it runs. Does nothing if the user prefers reduced motion.
function useScramble(text, { duration = 900, frameRate = 60, band = 3 } = {}) {
  const [display, setDisplay] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const timer = useRef(null);

  const stop = useCallback(() => {
    clearInterval(timer.current);
    timer.current = null;
  }, []);

  const scramble = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stop();
    setIsScrambling(true);
    const start = performance.now();

    timer.current = setInterval(() => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      // Front edge of the band; it runs past the end so the last letters settle too
      const head = Math.floor(progress * (text.length + band));
      setDisplay(scrambleText(text, head - band, head));

      if (progress === 1) {
        stop();
        setIsScrambling(false);
      }
    }, frameRate);
  }, [text, duration, frameRate, band, stop]);

  // Clear the timer if the component unmounts mid-scramble
  useEffect(() => stop, [stop]);

  return { display, scramble, isScrambling };
}

export default useScramble;
