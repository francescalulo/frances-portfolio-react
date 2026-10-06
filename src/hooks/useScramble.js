import { useCallback, useEffect, useRef, useState } from "react";

// Scrambles a small band of letters that sweeps left to right across `text`,
// using the word's own letters (case matched) so it feels like the word rearranging itself.
// Brackets, slashes and spaces stay fixed. Does nothing if the user prefers reduced motion.
function useScramble(text, { duration = 900, frameRate = 60, band = 3 } = {}) {
  const [display, setDisplay] = useState(text);
  const timer = useRef(null);

  const stop = useCallback(() => {
    clearInterval(timer.current);
    timer.current = null;
  }, []);

  const scramble = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stop();
    const pool = text.replace(/[^a-z0-9]/gi, ""); // "<TheLounge/>" → "TheLounge"
    const start = performance.now();

    timer.current = setInterval(() => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      // Front edge of the band; it runs past the end so the last letters settle too
      const head = Math.floor(progress * (text.length + band));

      setDisplay(
        text
          .split("")
          .map((char, index) => {
            const inBand = index < head && index >= head - band;
            if (!inBand || !/[a-z0-9]/i.test(char)) return char;

            const pick = pool[Math.floor(Math.random() * pool.length)];
            return char === char.toUpperCase()
              ? pick.toUpperCase()
              : pick.toLowerCase();
          })
          .join(""),
      );

      if (progress === 1) stop();
    }, frameRate);
  }, [text, duration, frameRate, band, stop]);

  // Clear the timer if the component unmounts mid-scramble
  useEffect(() => stop, [stop]);

  return { display, scramble };
}

export default useScramble;
