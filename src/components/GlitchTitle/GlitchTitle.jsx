import { useEffect } from "react";
import useScramble from "../../hooks/useScramble";
import ScrambleText from "../ScrambleText/ScrambleText";
import { whenIntroDone } from "../../utilities/Utilities";
import "./GlitchTitle.scss";

// A page title that shuffles in with the RGB-split glitch (like the nav and the About
// photo) when the page opens, and again on hover. Screen readers get the plain title.
// Give it key={title} so a new title starts fresh. Nothing moves with reduced motion.
function GlitchTitle({ title, id, className }) {
  const { display, scramble, isScrambling } = useScramble(title, {
    duration: 1000,
    band: 6,
  });

  // Plays once the intro (preloader) has finished
  useEffect(() => {
    let isActive = true;
    whenIntroDone().then(() => {
      if (isActive) scramble();
    });
    return () => {
      isActive = false;
    };
  }, [scramble]);

  return (
    <h1
      id={id}
      className={
        "glitch-title " + className + (isScrambling ? " is-glitching" : "")
      }
      onMouseEnter={scramble}
    >
      <ScrambleText text={title} display={display} wrap />
    </h1>
  );
}

export default GlitchTitle;
