import { useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  scrambleText,
  standIn,
  whenIntroDone,
} from "../../utilities/Utilities";
import DecodeSwitch from "../DecodeSwitch/DecodeSwitch";
import "./DecodeText.scss";

const SHUFFLE_TIME = 1200; // ms for the shuffle band to sweep across the text (like the nav)
const SHUFFLE_FRAME = 60; // ms between shuffle frames (same as the nav)
const SHUFFLE_BAND = 8; // letters shuffling at once (wider than the nav's 3: this text is longer)
const SETTLE_BAND = 2; // while typing, the newest letters flicker before they settle
const RIPPLE_REACH = 2; // desktop: letters either side of the mouse that shuffle on the code
const RIPPLE_TIME = 150; // ms the ripple letters stay shuffled after the mouse moves
const ERASE_TIME = 1000; // ms to backspace the current text (the last letters shuffle as they go)
const PAUSE = 400; // ms the cursor blinks before typing starts
const TYPE_MIN = 45; // ms per letter for the message (random between MIN and MAX)
const TYPE_MAX = 95;
const RETURN_MIN = 15; // ms per letter when typing the code back
const RETURN_MAX = 30;
const CODE_MIN = 8; // large copies (startDecoded): ms per letter when typing the code
const CODE_MAX = 18;
const STATEMENT_MIN = 30; // large copies: ms per letter when the message types back
const STATEMENT_MAX = 65;
const THINK_MIN = 180; // extra pause after . , ; ! ?
const THINK_MAX = 420;
const TYPO_CHANCE = 0.05; // chance of a typo on any letter
const TYPO_PAUSE = 400; // "oops" pause before fixing it
const BACKSPACE = 70; // ms per deleted typo letter
const HOLD = 8000; // desktop: decoded stays this long after the mouse stops moving
const LEAVE_DELAY = 3000; // decoded-by-default text: back to the message this long after the mouse leaves
const TOUCH_HOLD = 8000; // decoded-by-default text on touch: back to the message this long after a tap
const WORD_SHUFFLE = 500; // colorShuffle: ms a finished word shuffles before it settles white
const TINT_COLOURS = 4; // colorShuffle: how many syntax colours the letters cycle through (see .scss)

const WRONG_KEYS = "asdfghjklqwertyuiopzxcvbnm";
const between = (min, max) => min + Math.random() * (max - min);
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const flatten = (lines) =>
  lines
    .flatMap((line) => line.segments.map((segment) => segment.text))
    .join("");

// colorShuffle: the word number of every letter (a space or a new line starts the next word)
function wordIndexes(lines) {
  const wordOf = [];
  let word = 0;
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) word += 1;
    for (const segment of line.segments) {
      for (const char of segment.text) {
        if (char === " " || char === "\u00A0") word += 1; // a non-breaking space still separates words
        wordOf.push(word);
      }
    }
  });
  return wordOf;
}

// Finds which character of the text is under the mouse (for the hover ripple).
// Each segment <span> carries data-start: where it begins in the whole text.
// Shuffled letters are wrapped in their own span, so count them as one letter each.
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

  const segment = node?.parentElement?.closest("[data-start]");
  if (!segment) return null;

  let count = 0;
  for (const child of segment.childNodes) {
    if (child === node) {
      count += offset;
      break;
    }
    if (child.contains(node)) break; // inside a shuffled letter: that letter
    if (child.nodeType === Node.TEXT_NODE) count += child.length;
    else if (child.classList.contains("decode__glyph")) count += 1;
  }

  return Number(segment.dataset.start) + count;
}

// Draws `real` text, but any letter that's currently shuffled shows its stand-in on top
// of the real (invisible) letter. Each letter keeps its real width, so nothing reflows.
// tintFrom (colorShuffle): where this text starts in the whole message. Every letter gets
// its own span (keyed by position). `phases` says what each letter is doing: 0 = settled
// (white), anything else = still in its word's syntax colour (typing, or shuffling).
// wordOf says which word each letter belongs to, so a whole word shares one colour.
function renderChars(
  real,
  fake,
  tintFrom = null,
  wordOf = null,
  phases = null,
) {
  if (tintFrom !== null) {
    return real.split("").map((char, i) => {
      const index = tintFrom + i;
      const isShuffled = fake && fake[i] !== char;
      return (
        <span
          key={index}
          className={
            phases[index] !== 0
              ? "decode__tint decode__tint--" + (wordOf[index] % TINT_COLOURS)
              : undefined
          }
        >
          {isShuffled ? (
            <span className="decode__glyph">
              <span className="decode__glyph-real">{char}</span>
              <span className="decode__glyph-fake">{fake[i]}</span>
            </span>
          ) : (
            char
          )}
        </span>
      );
    });
  }

  if (!fake || fake === real) return real;

  const parts = [];
  let run = "";

  for (let i = 0; i < real.length; i += 1) {
    if (fake[i] === real[i]) {
      run += real[i];
      continue;
    }
    if (run) {
      parts.push(run);
      run = "";
    }
    parts.push(
      <span key={i} className="decode__glyph">
        <span className="decode__glyph-real">{real[i]}</span>
        <span className="decode__glyph-fake">{fake[i]}</span>
      </span>,
    );
  }
  if (run) parts.push(run);

  return parts;
}

// Draws one version. The first `shown` characters are visible, the rest keep their space
// invisibly (no jumping). Any typo letters and the cursor sit right after the last
// visible character, in a zero-width box so they never push the text either.
// `shown === null` means everything is visible.
// `scrambled` (optional) is the whole text with some letters shuffled.
// `tint` (optional, colorShuffle): null = no colours, or each letter's phase (see renderChars).
function renderLines(lines, shown, showCaret, typo, scrambled, tint = null) {
  let index = 0;
  const total = flatten(lines).length;
  const caretAt = shown === null ? total : shown;
  let caretPlaced = false;

  const wordOf = tint ? wordIndexes(lines) : null;

  return lines.map((line, lineIndex) => (
    <p key={lineIndex} className={line.className}>
      {line.segments.map((segment, segmentIndex) => {
        const start = index;
        const length = segment.text.length;
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

        const visible = segment.text.slice(0, visibleCount);
        const fake = scrambled
          ? scrambled.slice(start, start + visibleCount)
          : null;
        const pending = segment.text.slice(visibleCount);

        return (
          <span
            key={segmentIndex}
            className={segment.className}
            data-start={start}
          >
            {renderChars(visible, fake, tint ? start : null, wordOf, tint)}
            {caretHere && (
              <span className="decode__cursor">
                {typo && <span className="decode__typo">{typo}</span>}
                <span className="decode__caret" />
              </span>
            )}
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
// Rests as code by default (hero): scroll types the message, resets when scrolled away;
// desktop hover types it, moving the mouse keeps it, it re-codes HOLD ms after the mouse
// stops; moving over the resting code makes the letters near the mouse ripple; tap retypes.
// startDecoded (large copies): rests as the readable message and mirrors that: hover (or tap)
// types the code, it goes back LEAVE_DELAY after the mouse leaves (TOUCH_HOLD after a tap),
// and scrolling never codes it. Optional toggle switch: puts the visitor in control (stops auto).
// Optional onSwitch(target): called each time it starts switching (e.g. to glitch a photo).
// Optional colorShuffle: when the message is typed back, each word types in its own solid
// syntax colour; once the word is finished its letters shuffle and settle white, one by one.
// The text is visual only (aria-hidden): give screen readers the real text separately.
// Reduce motion: switches instantly (no shuffle, typing, glow or ripple).
function DecodeText({
  coded,
  decoded,
  startDecoded = false,
  toggle = false,
  colorShuffle = false,
  onSwitch,
  className = "",
}) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const restingState = startDecoded ? "decoded" : "coded";
  const awayState = startDecoded ? "coded" : "decoded"; // what hover / tap switches to

  const [active, setActive] = useState(restingState);
  const [goal, setGoal] = useState(restingState);
  const [shown, setShown] = useState(null);
  const [typo, setTypo] = useState("");
  const [scrambled, setScrambled] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasLanded, setHasLanded] = useState(false); // glow once the message finishes
  const [isTinting, setIsTinting] = useState(false); // colorShuffle: message being typed back
  const [tintPhases, setTintPhases] = useState(null); // colorShuffle: each letter's phase

  const stageRef = useRef(null);
  const timer = useRef(null);
  const holdTimer = useRef(null);
  const rippleTimer = useRef(null);
  const lastRipple = useRef(0);
  const activeRef = useRef(restingState);
  const shownRef = useRef(null);
  const isManual = useRef(false); // true once the visitor uses the toggle
  const isHovering = useRef(false); // desktop: is the mouse over the text right now
  const playRef = useRef(null); // the latest play(), for timers started inside play itself
  const onSwitchRef = useRef(onSwitch); // a ref, so play() doesn't restart on re-render

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
      onSwitchRef.current?.(target);
      setGoal(target);
      setTypo("");
      setScrambled(null);
      setIsTinting(colorShuffle && target === "decoded");
      setTintPhases(null);
      setHasLanded(false);

      if (prefersReducedMotion()) {
        setIsTinting(false); // no colour with reduced motion
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

      // Large copies (startDecoded): typing the code is quicker, with no "thinking" pauses
      // (code is full of , ;); typing the message back is unhurried, with typos, like the
      // hero's message. The hero keeps its own speeds (only its return to code is quick).
      const isCode = startDecoded && target === "coded";
      const isQuick = fast && !startDecoded;

      // colorShuffle: each word types in its colour; once it's finished (the next word has
      // started) its letters shuffle and settle white, left to right, over WORD_SHUFFLE ms.
      const isTint = colorShuffle && target === "decoded";
      const words = isTint ? wordIndexes(linesFor(target)) : null;
      const wordStart = {};
      const wordLength = {};
      words?.forEach((word, i) => {
        wordStart[word] ??= i;
        wordLength[word] = (wordLength[word] ?? 0) + 1;
      });
      const doneAt = {}; // word → when it was finished
      const pool = chars.replace(/[^a-z0-9]/gi, "").split("");
      const randomLetter = (char) => standIn(char, pool);

      // Marks every word before the one being typed as finished
      const markDone = (upToWord) => {
        for (let word = 0; word < upToWord; word += 1) {
          doneAt[word] ??= performance.now();
        }
      };

      // Works out each letter's phase (1 = colour, 2 = shuffling, 0 = white) and the
      // shuffled letters, then draws them. Returns true once every letter is white.
      const updateTint = () => {
        const now = performance.now();
        let allWhite = true;
        const phases = words.map((word, i) => {
          if (doneAt[word] === undefined) {
            allWhite = false;
            return 1;
          }
          const progress = (now - doneAt[word]) / WORD_SHUFFLE;
          const position = (i - wordStart[word] + 1) / wordLength[word];
          if (progress >= position) return 0;
          allWhite = false;
          return 2;
        });
        const text = chars
          .split("")
          .map((char, i) => {
            const isSettling = i >= count - SETTLE_BAND && i < count;
            return (phases[i] === 2 || isSettling) && /[a-z0-9]/i.test(char)
              ? randomLetter(char)
              : char;
          })
          .join("");
        setTintPhases(phases);
        setScrambled(text);
        return allWhite;
      };

      const step = () => {
        const next = chars[count];

        if (
          !isQuick &&
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
        if (isTint) {
          markDone(words[count - 1]);
          updateTint();
        } else {
          // The newest letters flicker, then settle as the next ones are typed
          setScrambled(scrambleText(chars, count - SETTLE_BAND, count));
        }

        if (count >= chars.length) {
          finish();
          return;
        }

        let delay;
        if (isQuick) delay = between(RETURN_MIN, RETURN_MAX);
        else if (isCode) delay = between(CODE_MIN, CODE_MAX);
        else if (startDecoded) delay = between(STATEMENT_MIN, STATEMENT_MAX);
        else delay = between(TYPE_MIN, TYPE_MAX);
        if (!isQuick && !isCode && /[.,;!?]/.test(next))
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
        const settle = () => {
          setScrambled(null);
          show(null);
          setIsAnimating(false);
          if (target === "decoded") setHasLanded(true);
        };

        // colorShuffle: the last words finish shuffling to white, then settle
        const tail = () => {
          if (updateTint()) {
            setIsTinting(false);
            settle();
          } else {
            schedule(tail, SHUFFLE_FRAME);
          }
        };

        // Let the last letters flicker one more beat, then settle and glow
        schedule(() => {
          if (isTint) {
            count = chars.length + SETTLE_BAND; // no more cursor flicker
            markDone(words[words.length - 1] + 1);
            tail();
          } else {
            settle();
          }
        }, SHUFFLE_FRAME);

        // Go back to the resting version after a while (unless the visitor took control).
        // Rests as code (hero): desktop only, HOLD ms (moving the mouse resets it).
        // Rests decoded: HOLD while the mouse is still over it, LEAVE_DELAY once it has
        // left, or TOUCH_HOLD after a tap.
        if (target === awayState && !isManual.current) {
          let delay = null;
          if (!startDecoded) delay = canHover ? HOLD : null;
          else if (canHover) delay = isHovering.current ? HOLD : LEAVE_DELAY;
          else delay = TOUCH_HOLD;

          if (delay !== null) {
            holdTimer.current = setTimeout(
              () => playRef.current(restingState, { fast: true }),
              delay,
            );
          }
        }
      };

      // Shuffle only when the full text is showing; if it was stopped mid-typing,
      // go straight to backspacing what's there.
      if (shownRef.current === null) shuffle();
      else erase();
    },
    // stop/show/switchTo only touch refs and setters, so they're safe to leave out
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canHover, colorShuffle, linesFor, startDecoded],
  );

  // Timers started inside play() call the latest play() through this ref
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    onSwitchRef.current = onSwitch;
  }, [onSwitch]);

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

  // Desktop: hovering switches to the other version (hero: the message; large copies: the code)
  function handleMouseEnter() {
    isHovering.current = true;
    if (!canHover || isManual.current || isAnimating) return;

    if (active !== awayState) {
      play(awayState);
    } else if (startDecoded) {
      // Came back before it went back to the message: keep the code while hovering
      clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(
        () => play(restingState, { fast: true }),
        HOLD,
      );
    }
  }

  // Desktop: the code ripples under the mouse (hero and large copies);
  // while the other version is showing, moving the mouse keeps it there
  function handleMouseMove(event) {
    if (!canHover || isAnimating) return;

    if (active === "coded") ripple(event);

    if (!isManual.current && active === awayState) {
      clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(
        () => play(restingState, { fast: true }),
        HOLD,
      );
    }
  }

  // Desktop, large copies only: back to the message shortly after the mouse leaves
  function handleMouseLeave() {
    isHovering.current = false;
    if (!canHover || isManual.current || !startDecoded || isAnimating) return;

    if (active === awayState) {
      clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(
        () => play(restingState, { fast: true }),
        LEAVE_DELAY,
      );
    }
  }

  // Touch: tap plays it (hero: retypes the message; large copies: types the code)
  function handleClick() {
    if (!canHover && !isManual.current && !isAnimating) play(awayState);
  }

  // Toggle: the visitor takes control (no more automatic switching)
  function handleToggle() {
    isManual.current = true;
    play(goal === "decoded" ? "coded" : "decoded", {
      fast: goal === "decoded",
    });
  }

  // Scroll (every device): type when mostly on screen, quietly reset when it leaves.
  // Only text that rests as code types itself on scroll; large copies stay readable.
  // Text that types itself waits for the intro (preloader) to finish first.
  useEffect(() => {
    const element = stageRef.current;
    let isInView = false;
    let isActive = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isManual.current) return;
        if (entry.isIntersecting) {
          if (restingState === "coded") {
            whenIntroDone().then(() => {
              if (isActive && isInView && !isManual.current) play(awayState);
            });
          }
        } else {
          stop();
          switchTo(restingState);
          setGoal(restingState);
          show(null);
          setTypo("");
          setScrambled(null);
          setHasLanded(false);
          setIsTinting(false);
          setIsAnimating(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => {
      isActive = false;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, restingState]);

  // Clear timers if the component unmounts mid-animation
  useEffect(() => stop, []);

  // Cursor: while typing, and while the other version is showing
  // (hero: the message; large copies: the code). Never on resting decoded text.
  const showCaret = isAnimating || active === awayState;

  return (
    <div className={"decode " + className}>
      <div
        ref={stageRef}
        className={
          "decode__stage" + (isAnimating || scrambled ? " is-moving" : "")
        }
        aria-hidden="true"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className={"decode__layer" + (active === "coded" ? " is-active" : "")}
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
          className={
            "decode__layer" +
            (active === "decoded" ? " is-active" : "") +
            (hasLanded ? " is-landed" : "")
          }
        >
          {renderLines(
            decoded,
            active === "decoded" ? shown : null,
            showCaret && active === "decoded",
            active === "decoded" ? typo : "",
            active === "decoded" ? scrambled : null,
            active === "decoded" && isTinting ? tintPhases : null,
          )}
        </div>
      </div>

      {toggle && (
        <DecodeSwitch isDecoded={goal === "decoded"} onClick={handleToggle} />
      )}
    </div>
  );
}

export default DecodeText;
