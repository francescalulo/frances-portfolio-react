import { useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import "./DecodeText.scss";

const SHUFFLE_TIME = 900; // ms for the shuffle band to sweep across the text (like the nav)
const SHUFFLE_FRAME = 60; // ms between shuffle frames (same as the nav)
const SHUFFLE_BAND = 8; // letters shuffling at once (wider than the nav's 3: this text is longer)
const SETTLE_BAND = 2; // while typing, the newest letters flicker before they settle
const RIPPLE_REACH = 2; // desktop: letters either side of the mouse that shuffle on the code
const RIPPLE_TIME = 150; // ms the ripple letters stay shuffled after the mouse moves
const ERASE_TIME = 800; // ms to backspace the current text (the last letters shuffle as they go)
const PAUSE = 300; // ms the cursor blinks before typing starts
const TYPE_MIN = 30; // ms per letter for the message (random between MIN and MAX)
const TYPE_MAX = 70;
const RETURN_MIN = 15; // ms per letter when typing the code back
const RETURN_MAX = 30;
const THINK_MIN = 180; // extra pause after . , ; ! ?
const THINK_MAX = 420;
const TYPO_CHANCE = 0.05; // chance of a typo on any letter
const TYPO_PAUSE = 400; // "oops" pause before fixing it
const BACKSPACE = 70; // ms per deleted typo letter
const HOLD = 8000; // desktop: decoded stays this long after the mouse stops moving

const WRONG_KEYS = "asdfghjklqwertyuiopzxcvbnm";
const between = (min, max) => min + Math.random() * (max - min);
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const flatten = (lines) =>
  lines
    .flatMap((line) => line.segments.map((segment) => segment.text))
    .join("");

// Shuffles the letters of `text` between `from` and `to` using the text's own letters
// (case matched), like the nav. Spaces and symbols stay put.
function scrambleText(text, from, to) {
  const pool = text.replace(/[^a-z0-9]/gi, "");
  return text
    .split("")
    .map((char, index) => {
      if (index < from || index >= to || !/[a-z0-9]/i.test(char)) return char;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      return char === char.toUpperCase()
        ? pick.toUpperCase()
        : pick.toLowerCase();
    })
    .join("");
}

// Finds which character of the text is under the mouse (for the hover ripple).
// Each segment <span> carries data-start: where it begins in the whole text.
function indexAtPoint(x, y) {
  let node = null;
  let offset = 0;

  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    if (position) ({ offsetNode: node, offset } = position);
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    if (range) ({ startContainer: node, startOffset: offset } = range);
  }

  const start = node?.parentElement?.dataset.start;
  return start === undefined ? null : Number(start) + offset;
}

// Draws one version. The first `shown` characters are visible, the rest keep their space
// invisibly (no jumping). Any typo letters and the cursor sit right after the last
// visible character. `shown === null` means everything is visible.
// `scrambled` (optional) is the whole text with some letters shuffled, drawn in place
// of the real letters so the colours and line breaks stay the same.
function renderLines(lines, shown, showCaret, typo, scrambled) {
  let index = 0;
  const total = flatten(lines).length;
  const caretAt = shown === null ? total : shown;
  let caretPlaced = false;

  return lines.map((line, lineIndex) => (
    <p key={lineIndex} className={line.className}>
      {line.segments.map((segment, segmentIndex) => {
        const start = index;
        const length = segment.text.length;
        const text = scrambled
          ? scrambled.slice(index, index + length)
          : segment.text;
        const visibleCount =
          shown === null
            ? length
            : Math.max(0, Math.min(shown - index, length));
        const caretHere =
          showCaret &&
          !caretPlaced &&
          caretAt >= index &&
          caretAt <= index + length;
        if (caretHere) caretPlaced = true;
        index += length;

        const pending = segment.text.slice(visibleCount);

        return (
          <span
            key={segmentIndex}
            className={segment.className}
            data-start={start}
          >
            {text.slice(0, visibleCount)}
            {caretHere && typo && <span className="decode__typo">{typo}</span>}
            {caretHere && <span className="decode__caret" />}
            {pending && <span className="decode__pending">{pending}</span>}
          </span>
        );
      })}
    </p>
  ));
}

// Types between a coded and a decoded version of some text, like someone coding:
// shuffle sweep (like the nav) → shuffling backspace → pause → type (each letter flickers
// before it settles, with the odd typo, fixed) → blinking cursor → soft glow on the message.
// Scroll: types when in view, resets when scrolled away. Desktop: hovering types it;
// moving the mouse over it keeps it decoded; it re-codes HOLD ms after the mouse stops;
// moving over the resting code makes the letters near the mouse ripple.
// Touch: tap retypes. Optional toggle switch: puts the visitor in control (stops auto).
// The text is visual only (aria-hidden): give screen readers the real text separately.
// Reduce motion: switches instantly (no shuffle, typing, glow or ripple).
function DecodeText({
  coded,
  decoded,
  startDecoded = false,
  toggle = false,
  className = "",
}) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const restingState = startDecoded ? "decoded" : "coded";

  const [active, setActive] = useState(restingState);
  const [goal, setGoal] = useState(restingState);
  const [shown, setShown] = useState(null);
  const [typo, setTypo] = useState("");
  const [scrambled, setScrambled] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasLanded, setHasLanded] = useState(false); // glow once the message finishes

  const stageRef = useRef(null);
  const timer = useRef(null);
  const holdTimer = useRef(null);
  const rippleTimer = useRef(null);
  const lastRipple = useRef(0);
  const activeRef = useRef(restingState);
  const shownRef = useRef(null);
  const isManual = useRef(false); // true once the visitor uses the toggle

  const linesFor = useCallback(
    (state) => (state === "decoded" ? decoded : coded),
    [coded, decoded],
  );

  const show = (value) => {
    shownRef.current = value;
    setShown(value);
  };

  const switchTo = (state) => {
    activeRef.current = state;
    setActive(state);
  };

  const stop = () => {
    clearTimeout(timer.current);
    clearTimeout(holdTimer.current);
    clearTimeout(rippleTimer.current);
  };

  const play = useCallback(
    (target, { fast = false } = {}) => {
      stop();
      setGoal(target);
      setTypo("");
      setScrambled(null);
      setHasLanded(false);

      if (prefersReducedMotion()) {
        switchTo(target);
        show(null);
        setIsAnimating(false);
        return;
      }

      setIsAnimating(true);
      const schedule = (fn, ms) => {
        timer.current = setTimeout(fn, ms);
      };

      const current = flatten(linesFor(activeRef.current));

      // 1. Shuffle: a band of letters sweeps left to right across the text
      let shuffleStart = null;

      const shuffle = () => {
        shuffleStart ??= performance.now();
        const progress = Math.min(
          (performance.now() - shuffleStart) / SHUFFLE_TIME,
          1,
        );
        // Front edge of the band; it runs past the end so the last letters settle too
        const head = Math.floor(progress * (current.length + SHUFFLE_BAND));
        setScrambled(scrambleText(current, head - SHUFFLE_BAND, head));

        if (progress < 1) {
          schedule(shuffle, SHUFFLE_FRAME);
        } else {
          setScrambled(null);
          erase();
        }
      };

      // 2. Backspace: the text shrinks from the end while the last few letters
      //    before the cursor keep shuffling, so it looks chewed up rather than wiped
      const from = shownRef.current ?? current.length;
      let eraseStart = null;
      let lastShuffle = 0;

      const erase = () => {
        const now = performance.now();
        eraseStart ??= now;
        const progress = Math.min((now - eraseStart) / ERASE_TIME, 1);
        const left = Math.round(from * (1 - progress));
        show(left);

        // Re-shuffle at the nav's pace (60ms), not every frame, so it doesn't flicker
        if (now - lastShuffle >= SHUFFLE_FRAME) {
          lastShuffle = now;
          setScrambled(
            left > 0 ? scrambleText(current, left - SHUFFLE_BAND, left) : null,
          );
        }

        if (progress < 1) {
          schedule(erase, 16);
        } else {
          setScrambled(null);
          switchTo(target);
          show(0);
          schedule(step, PAUSE);
        }
      };

      // 3. Type the target, letter by letter, with the odd typo (message only)
      const chars = flatten(linesFor(target));
      let count = 0;
      let wrong = "";
      let skipTypo = false;

      const step = () => {
        const next = chars[count];

        if (
          !fast &&
          !skipTypo &&
          count > 3 &&
          /[a-z]/i.test(next) &&
          Math.random() < TYPO_CHANCE
        ) {
          typeWrong(Math.random() < 0.7 ? 1 : 2, next);
          return;
        }
        skipTypo = false;

        count += 1;
        show(count);
        // The newest letters flicker, then settle as the next ones are typed
        setScrambled(scrambleText(chars, count - SETTLE_BAND, count));

        if (count >= chars.length) {
          finish();
          return;
        }

        let delay = fast
          ? between(RETURN_MIN, RETURN_MAX)
          : between(TYPE_MIN, TYPE_MAX);
        if (!fast && /[.,;!?]/.test(next))
          delay += between(THINK_MIN, THINK_MAX);
        schedule(step, delay);
      };

      // Types 1–2 wrong letters, pauses, then backspaces them
      const typeWrong = (amount, intended) => {
        setScrambled(null); // settle the last letters before the "oops"
        const isUpper = intended === intended.toUpperCase();
        const add = () => {
          const key = WRONG_KEYS[Math.floor(Math.random() * WRONG_KEYS.length)];
          wrong += isUpper ? key.toUpperCase() : key;
          setTypo(wrong);
          if (wrong.length < amount) schedule(add, between(TYPE_MIN, TYPE_MAX));
          else schedule(fix, TYPO_PAUSE);
        };
        add();
      };

      const fix = () => {
        wrong = wrong.slice(0, -1);
        setTypo(wrong);
        if (wrong) {
          schedule(fix, BACKSPACE);
        } else {
          skipTypo = true; // type the right letter next
          schedule(step, between(TYPE_MIN, TYPE_MAX));
        }
      };

      const finish = () => {
        // Let the last letters flicker one more beat, then settle and glow
        schedule(() => {
          setScrambled(null);
          show(null);
          setIsAnimating(false);
          if (target === "decoded") setHasLanded(true);
        }, SHUFFLE_FRAME);

        // Desktop: re-code after a while (unless the visitor took control or it rests decoded)
        if (
          canHover &&
          target === "decoded" &&
          !startDecoded &&
          !isManual.current
        ) {
          holdTimer.current = setTimeout(
            () => play("coded", { fast: true }),
            HOLD,
          );
        }
      };

      // Shuffle only when the full text is showing; if it was stopped mid-typing,
      // go straight to backspacing what's there.
      if (shownRef.current === null) shuffle();
      else erase();
    },
    // stop/show/switchTo only touch refs and setters, so they're safe to leave out
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canHover, linesFor, startDecoded],
  );

  // Desktop: the letters near the mouse ripple (shuffle briefly) on the resting code
  function ripple(event) {
    if (prefersReducedMotion()) return;

    const now = performance.now();
    if (now - lastRipple.current < SHUFFLE_FRAME) return; // the nav's pace
    lastRipple.current = now;

    const index = indexAtPoint(event.clientX, event.clientY);
    if (index === null) return;

    setScrambled(
      scrambleText(
        flatten(coded),
        index - RIPPLE_REACH,
        index + RIPPLE_REACH + 1,
      ),
    );
    clearTimeout(rippleTimer.current);
    rippleTimer.current = setTimeout(() => setScrambled(null), RIPPLE_TIME);
  }

  // Desktop: hovering the code types the message
  function handleMouseEnter() {
    if (!canHover || isManual.current || isAnimating) return;
    if (startDecoded || active !== "decoded") play("decoded");
  }

  // Desktop: on the code, letters ripple; on the decoded message, moving keeps it there
  function handleMouseMove(event) {
    if (!canHover || isAnimating) return;

    if (active === "coded") {
      ripple(event);
      return;
    }

    if (!isManual.current && !startDecoded) {
      clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(() => play("coded", { fast: true }), HOLD);
    }
  }

  // Touch: tap retypes
  function handleClick() {
    if (!canHover && !isManual.current && !isAnimating) play("decoded");
  }

  // Toggle: the visitor takes control (no more automatic switching)
  function handleToggle() {
    isManual.current = true;
    play(goal === "decoded" ? "coded" : "decoded", {
      fast: goal === "decoded",
    });
  }

  // Scroll (every device): type when mostly on screen, quietly reset when it leaves
  useEffect(() => {
    const element = stageRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isManual.current) return;
        if (entry.isIntersecting) {
          play("decoded");
        } else {
          stop();
          switchTo(restingState);
          setGoal(restingState);
          show(null);
          setTypo("");
          setScrambled(null);
          setHasLanded(false);
          setIsAnimating(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, restingState]);

  // Clear timers if the component unmounts mid-animation
  useEffect(() => stop, []);

  // Cursor: while typing, and while the decoded message is showing
  const showCaret = isAnimating || active === "decoded";

  return (
    <div className={`decode ${className}`}>
      <div
        ref={stageRef}
        className="decode__stage"
        aria-hidden="true"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div
          className={`decode__layer${active === "coded" ? " is-active" : ""}`}
        >
          {renderLines(
            coded,
            active === "coded" ? shown : null,
            showCaret && active === "coded",
            active === "coded" ? typo : "",
            active === "coded" ? scrambled : null,
          )}
        </div>
        <div
          className={`decode__layer${active === "decoded" ? " is-active" : ""}${hasLanded ? " is-landed" : ""}`}
        >
          {renderLines(
            decoded,
            active === "decoded" ? shown : null,
            showCaret && active === "decoded",
            active === "decoded" ? typo : "",
            active === "decoded" ? scrambled : null,
          )}
        </div>
      </div>

      {toggle && (
        <button
          type="button"
          className="decode__toggle"
          aria-pressed={goal === "decoded"}
          aria-label="Show the decoded message"
          onClick={handleToggle}
        >
          <span className="decode__toggle-knob" aria-hidden="true" />
          <span className="decode__toggle-label" aria-hidden="true">
            {goal === "decoded" ? "Code" : "Decode"}
          </span>
        </button>
      )}
    </div>
  );
}

export default DecodeText;
