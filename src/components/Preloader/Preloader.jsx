import { useEffect, useRef, useState } from "react";
import { finishIntro, scrambleText } from "../../utilities/Utilities";
import LogoMark from "../LogoMark/LogoMark";
import "./Preloader.scss";

const NAME = "francesCalulo"; // written like code (camelCase)
const SEEN_KEY = "fc-intro-seen"; // once per visit (tab session)

// Typing, like the hero: a random beat per letter, the newest letters flicker before
// they settle, a typo that gets backspaced, and a blinking cursor throughout
const START_DELAY = 350; // ms the empty "{ }" blinks before typing starts
const TYPE_MIN = 40; // ms per letter (random between MIN and MAX)
const TYPE_MAX = 70;
const SETTLE_BAND = 2; // the newest letters flicker
const TYPO_AT = 8; // "francesC" then "la" by mistake…
const TYPO = "la";
const TYPO_PAUSE = 350; // "oops" pause before fixing it
const BACKSPACE = 60; // ms per deleted letter
const HOLD = 1200; // the full name rests (readable) with a blinking cursor
const SETTLE = 90; // ms a new letter flickers before it settles
const SWEEP_TIME = 700; // then a shuffle sweeps across the name, like the hero's
const SWEEP_BAND = 6; // letters shuffling at once in the sweep
const FRAME = 60; // ms between shuffle frames (same as the nav)

// Then it shrinks: quickly back to "frances", a little way out again ("francesCal"),
// then slowly letter by letter down to the "f", the brackets closing in behind it
const SHORT = 7; // "frances"
const BACK_OUT = 10; // "francesCal"
const PAUSE = 250; // ms between those moves
const SLOW_BACKSPACE = 110; // ms per letter on the slow way down to the f

// The f becomes the {f} logo, which flies into the header logo as the overlay fades
const LOGO_DELAY = 300; // the f rests, then turns into the logo
const MARK_TIME = 400; // the logo before it flies
const FLY_TIME = 500; // the flight + overlay fade
const SKIP_TIME = 250; // a skip just fades out
const GLITCH_TIME = 450; // the RGB-split glitch (same as the About photo)

const between = (min, max) => min + Math.random() * (max - min);
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The first time someone opens the site in a tab, and not with reduced motion
function shouldPlay() {
  if (prefersReducedMotion()) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage blocked (private mode): still play, it just may play again next time
  }
  return true;
}

// Every keystroke of the intro: { shown, room, typo, wait, glitch }
// shown: letters of the name on screen; room: letters that keep their space (the
// brackets sit around them); typo: wrong letters; wait: ms before this keystroke.
function keystrokes() {
  const steps = [];
  const key = (shown, room, typo, wait, glitch = false, sweep = false) =>
    steps.push({ shown, room, typo, wait, glitch, sweep });
  const full = NAME.length;

  // Typing: the whole name keeps its space, so the closing brace stays still
  for (let shown = 1; shown <= TYPO_AT; shown += 1) {
    key(
      shown,
      full,
      "",
      between(TYPE_MIN, TYPE_MAX),
      shown === 1 || shown === 5,
    );
  }
  key(TYPO_AT, full, TYPO.slice(0, 1), between(TYPE_MIN, TYPE_MAX), true);
  key(TYPO_AT, full, TYPO, between(TYPE_MIN, TYPE_MAX));
  key(TYPO_AT, full, TYPO.slice(0, 1), TYPO_PAUSE);
  key(TYPO_AT, full, "", BACKSPACE);
  for (let shown = TYPO_AT + 1; shown <= full; shown += 1) {
    key(shown, full, "", between(TYPE_MIN, TYPE_MAX), shown === full);
  }

  // While the full name rests, it keeps glitching (the letters stay readable), then a
  // shuffle sweeps across it before it starts backspacing
  key(full, full, "", HOLD / 2, true);
  key(full, full, "", HOLD / 2, false, true);

  // Shrinking: only the letters on screen keep their space, so the brackets follow
  for (let shown = full - 1; shown >= SHORT; shown -= 1) {
    key(
      shown,
      shown,
      "",
      shown === full - 1 ? SWEEP_TIME : BACKSPACE,
      shown === full - 1,
    );
  }
  for (let shown = SHORT + 1; shown <= BACK_OUT; shown += 1) {
    key(
      shown,
      shown,
      "",
      shown === SHORT + 1 ? PAUSE : between(TYPE_MIN, TYPE_MAX),
    );
  }
  for (let shown = BACK_OUT - 1; shown >= 1; shown -= 1) {
    key(
      shown,
      shown,
      "",
      shown === BACK_OUT - 1 ? PAUSE : SLOW_BACKSPACE,
      shown === 1,
    );
  }
  return steps;
}

// Intro: "{ }" with a blinking cursor, "francesCalulo" typed in like the hero (with a
// typo, fixed), glitching (an RGB split, like the About photo) as the letters shuffle;
// then it backspaces to "frances", types a little back out, and slowly backspaces down
// to the "f", which becomes the {f} logo and flies into the header logo as the overlay
// fades. The page renders underneath the whole time. Visual only (aria-hidden). Any key,
// click, tap or scroll skips it. Animations that wait for it (the hero) start when it ends.
function Preloader() {
  const [isPlaying] = useState(shouldPlay);
  const [phase, setPhase] = useState("type"); // type, mark, fly, skip, done
  const [shown, setShown] = useState(0); // letters of the name on screen
  const [room, setRoom] = useState(NAME.length); // letters that keep their space
  const [typo, setTypo] = useState(""); // wrong letters, before they're backspaced
  const [flicker, setFlicker] = useState(""); // the letters on screen, newest shuffled
  const [isGlitching, setIsGlitching] = useState(false);
  const [flight, setFlight] = useState(null); // transform that lands on the header logo
  const markRef = useRef(null);

  // Not playing (seen already, or reduced motion): let the page start right away
  useEffect(() => {
    if (!isPlaying) finishIntro();
  }, [isPlaying]);

  // The timeline
  useEffect(() => {
    if (!isPlaying) return;
    const timers = [];
    let time = START_DELAY;
    const at = (wait, fn) => {
      time += wait;
      timers.push(setTimeout(fn, time));
    };
    // Moves to the next part, unless it was skipped in the meantime
    const advance = (next) =>
      setPhase((current) =>
        current === "skip" || current === "done" ? current : next,
      );
    // Plays the glitch once: off for a frame, then on, so it restarts every time
    const glitch = () => {
      setIsGlitching(false);
      timers.push(setTimeout(() => setIsGlitching(true), 20));
      timers.push(setTimeout(() => setIsGlitching(false), 20 + GLITCH_TIME));
    };

    // The shuffle sweep: a band of letters runs left to right across the name
    let sweep = null;
    const sweepName = () => {
      const start = performance.now();
      sweep = setInterval(() => {
        const progress = Math.min((performance.now() - start) / SWEEP_TIME, 1);
        const head = progress * (NAME.length + SWEEP_BAND);
        setFlicker(scrambleText(NAME, head - SWEEP_BAND, head));
        if (progress === 1) clearInterval(sweep);
      }, FRAME);
    };

    let lastShown = 0;
    keystrokes().forEach((step) =>
      at(step.wait, () => {
        if (step.sweep) {
          sweepName();
          return;
        }
        const text = NAME.slice(0, step.shown);
        const isKeystroke = step.shown !== lastShown;
        lastShown = step.shown;
        setShown(step.shown);
        setRoom(step.room);
        setTypo(step.typo);
        // Like the hero: the letters by the cursor shuffle as it types or backspaces…
        setFlicker(
          isKeystroke
            ? scrambleText(text, step.shown - SETTLE_BAND, step.shown)
            : text,
        );
        // …then settle, so the name always reads correctly when it pauses
        timers.push(setTimeout(() => setFlicker(text), SETTLE));
        if (step.glitch) glitch();
      }),
    );

    at(LOGO_DELAY, () => advance("mark"));

    at(MARK_TIME, () => {
      const target = document.querySelector(".header__logo-mark");
      const mark = markRef.current;
      if (target && mark) {
        const to = target.getBoundingClientRect();
        const from = mark.getBoundingClientRect();
        const x = to.left + to.width / 2 - (from.left + from.width / 2);
        const y = to.top + to.height / 2 - (from.top + from.height / 2);
        setFlight(
          "translate(" +
            x +
            "px, " +
            y +
            "px) scale(" +
            to.width / from.width +
            ")",
        );
      }
      advance("fly");
    });

    at(FLY_TIME, () => advance("done"));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(sweep);
    };
  }, [isPlaying]);

  // Skip: any key, click, tap or scroll fades it out early
  useEffect(() => {
    if (!isPlaying || phase === "done" || phase === "skip") return;
    const skip = () => setPhase("skip");
    const events = ["keydown", "pointerdown", "wheel", "touchmove"];
    events.forEach((type) => window.addEventListener(type, skip));
    return () =>
      events.forEach((type) => window.removeEventListener(type, skip));
  }, [isPlaying, phase]);

  // After a skip, remove it once the fade has finished
  useEffect(() => {
    if (phase !== "skip") return;
    const timer = setTimeout(() => setPhase("done"), SKIP_TIME);
    return () => clearTimeout(timer);
  }, [phase]);

  // Done: let the page start (the hero types now)
  useEffect(() => {
    if (phase === "done") finishIntro();
  }, [phase]);

  // The page behind doesn't scroll while it plays
  useEffect(() => {
    if (!isPlaying || phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isPlaying, phase]);

  if (!isPlaying || phase === "done") return null;

  // The cursor (and any wrong letters) sits in a zero-width box right after the last
  // letter on screen, so it never pushes the text
  const cursor = (
    <span className="preloader__cursor">
      {typo && <span className="preloader__typo">{typo}</span>}
      <span className="preloader__caret" />
    </span>
  );

  // The line of text; drawn three times: the real one plus pink and blue copies that
  // split off when it glitches. Letters not typed yet keep their space (invisibly) while
  // typing; letters outside the room fold away, so the brackets close in.
  const line = (copy) => (
    <p
      className={"preloader__text" + (copy ? " preloader__text--" + copy : "")}
    >
      <span className="preloader__brace">{"{"}</span>
      {shown === 0 && cursor}
      {NAME.split("").map((char, index) => (
        <span
          key={index}
          className={
            "preloader__char" +
            (index >= shown ? " is-pending" : "") +
            (index >= room ? " is-gone" : "") +
            (room === 1 ? " is-logo-f" : "") // only the f left: the logo's green
          }
        >
          {flicker[index] ?? char}
          {index === shown - 1 && cursor}
        </span>
      ))}
      <span className="preloader__brace">{"}"}</span>
    </p>
  );

  return (
    <div className={"preloader is-" + phase} aria-hidden="true">
      <div className="preloader__stage">
        <div
          className={"preloader__line" + (isGlitching ? " is-glitching" : "")}
        >
          {line()}
          {line("pink")}
          {line("blue")}
        </div>

        <LogoMark
          ref={markRef}
          className="preloader__mark"
          width="512"
          height="512"
          style={flight ? { transform: flight } : undefined}
        />
      </div>
    </div>
  );
}

export default Preloader;
