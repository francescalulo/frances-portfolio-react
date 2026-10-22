import { useEffect, useRef, useState } from "react";
import { scrambleText } from "../../utilities/Utilities";
import "./CodeToggle.scss";

const SWEEP_TIME = 1200; // ms for the shuffle to sweep through the whole text
const FRAME = 60; // ms between shuffle frames (same as the nav)
const BAND = 40; // letters that are still shuffling just behind the sweep

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lengthOf = (lines) =>
  lines.reduce(
    (total, line) =>
      total +
      line.segments.reduce((sum, segment) => sum + segment.text.length, 0),
    0,
  );

// Every segment's text, with the letters from `from` to `to` (counted through the whole
// text) shuffled, width matched so no line re-wraps while it moves
function scrambleLines(lines, from, to) {
  let start = 0;
  return lines.map((line) =>
    line.segments.map((segment) => {
      const text = scrambleText(segment.text, from - start, to - start);
      start += segment.text.length;
      return text;
    }),
  );
}

function renderLines(lines, texts) {
  return lines.map((line, lineIndex) => (
    <p key={lineIndex} className={line.className}>
      {line.segments.map((segment, segmentIndex) => (
        <span key={segmentIndex} className={segment.className}>
          {texts?.[lineIndex][segmentIndex] ?? segment.text}
        </span>
      ))}
    </p>
  ));
}

// Code ↔ readable text, shown by the isDecoded prop (the parent owns the Decode / Code
// switch, so one switch can drive several of these). No typing: on a switch the old
// version dissolves into shuffling letters and fades out while the new one fades in and
// settles as the shuffle sweeps through it, and the box glides to the new height.
// numberRows: the code gets editor line numbers, one per row on screen (wrapped rows
// included), recounted when the screen is resized.
// Visual only (aria-hidden): give screen readers the real text separately.
// Reduced motion: switches instantly.
function CodeToggle({
  coded,
  decoded,
  isDecoded,
  numberRows = false,
  className = "",
}) {
  const [frame, setFrame] = useState(null); // while switching: each version's shuffled texts
  const [height, setHeight] = useState(null); // the showing version's height
  const [rows, setRows] = useState(0); // rows of code on screen (numberRows)
  const timer = useRef(null);
  const shown = useRef(isDecoded); // the version on screen before a switch
  const codedRef = useRef(null);
  const decodedRef = useRef(null);

  // A switch: sweep the shuffle from the old version to the new one
  useEffect(() => {
    if (shown.current === isDecoded) return;
    shown.current = isDecoded;
    if (prefersReducedMotion()) return;

    const incoming = isDecoded ? decoded : coded;
    const outgoing = isDecoded ? coded : decoded;
    const total = Math.max(lengthOf(incoming), lengthOf(outgoing)) + BAND;
    const start = performance.now();

    timer.current = setInterval(() => {
      const progress = Math.min((performance.now() - start) / SWEEP_TIME, 1);
      if (progress === 1) {
        clearInterval(timer.current);
        setFrame(null);
        return;
      }

      const head = progress * total; // front edge of the sweep
      const settling = scrambleLines(incoming, head - BAND, Infinity); // settles behind it
      const dissolving = scrambleLines(outgoing, 0, head); // dissolves behind it

      // Stored per version (not "incoming" / "outgoing"), so a quick second switch can
      // never draw one version's texts over the other's lines
      setFrame(
        isDecoded
          ? { coded: dissolving, decoded: settling }
          : { coded: settling, decoded: dissolving },
      );
    }, FRAME);

    return () => {
      clearInterval(timer.current);
      setFrame(null);
    };
  }, [isDecoded, coded, decoded]);

  // The box takes the height of the version that's showing (and follows it when the
  // screen is resized), so there's no empty space under the shorter one. CSS animates it.
  useEffect(() => {
    const layer = (isDecoded ? decodedRef : codedRef).current;
    const observer = new ResizeObserver(() => setHeight(layer.offsetHeight));
    observer.observe(layer);
    return () => observer.disconnect();
  }, [isDecoded]);

  // numberRows: count the code's rows (its height ÷ the line height) whenever it resizes
  useEffect(() => {
    if (!numberRows) return;

    const layer = codedRef.current;
    const observer = new ResizeObserver(() => {
      const lines = layer.querySelectorAll("p");
      if (lines.length === 0) return;

      const lineHeight = parseFloat(getComputedStyle(lines[0]).lineHeight);
      const top = lines[0].getBoundingClientRect().top;
      const bottom = lines[lines.length - 1].getBoundingClientRect().bottom;
      setRows(Math.round((bottom - top) / lineHeight));
    });
    observer.observe(layer);
    return () => observer.disconnect();
  }, [numberRows]);

  return (
    <div
      className={"code-toggle " + className}
      style={height ? { height: height + "px" } : undefined}
      aria-hidden="true"
    >
      <div
        ref={codedRef}
        className={"code-toggle__layer" + (isDecoded ? "" : " is-active")}
      >
        {numberRows && rows > 0 && (
          <span className="code-toggle__rows">
            {Array.from({ length: rows }, (_, index) => index + 1).join("\n")}
          </span>
        )}
        {renderLines(coded, frame?.coded)}
      </div>
      <div
        ref={decodedRef}
        className={"code-toggle__layer" + (isDecoded ? " is-active" : "")}
      >
        {renderLines(decoded, frame?.decoded)}
      </div>
    </div>
  );
}

export default CodeToggle;
