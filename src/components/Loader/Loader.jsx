import { useEffect, useState } from "react";
import useScramble from "../../hooks/useScramble";
import ScrambleText from "../ScrambleText/ScrambleText";
import "./Loader.scss";

const DELAY = 300; // ms before it appears, so quick loads never flash it
const REPEAT = 1400; // ms between shuffles while it's on screen

// Loading state: a code-style line (e.g. "fetching(work)…") whose letters shuffle like
// the nav, with a blinking caret. Screen readers only hear `label`.
// Place it inside an always-present role="status" region so the change is announced.
function Loader({ code, label }) {
  const [isVisible, setIsVisible] = useState(false);
  const { display, scramble } = useScramble(code);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Keeps shuffling while visible (useScramble does nothing with reduced motion)
  useEffect(() => {
    if (!isVisible) return;

    scramble();
    const timer = setInterval(scramble, REPEAT);
    return () => clearInterval(timer);
  }, [isVisible, scramble]);

  if (!isVisible) return null;

  return (
    <p className="loader">
      <ScrambleText text={code} display={display} label={label} />
      <span className="loader__caret" aria-hidden="true" />
    </p>
  );
}

export default Loader;
