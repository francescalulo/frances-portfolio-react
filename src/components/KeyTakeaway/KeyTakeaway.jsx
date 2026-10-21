import DecodeText from "../DecodeText/DecodeText";
import "./KeyTakeaway.scss";

// Colours the coded version like the rest of the site: 'strings' pink, keywords yellow,
// object keys green
const TOKEN =
  /('[^']*'|"[^"]*")|\b(const|let|var|function|return)\b|([A-Za-z_$][\w$]*)(?=\s*:)/g;

function toSegments(line) {
  const segments = [];
  let last = 0;

  for (const match of line.matchAll(TOKEN)) {
    if (match.index > last) {
      segments.push({ text: line.slice(last, match.index) });
    }
    const className = match[1]
      ? "key-takeaway__string"
      : match[2]
        ? "key-takeaway__keyword"
        : "key-takeaway__key";
    segments.push({ text: match[0], className });
    last = match.index + match[0].length;
  }

  if (last < line.length) segments.push({ text: line.slice(last) });
  return segments;
}

// Work Detail "Key Takeaway": the ACF key_takeaway text, decoded by default; hovering /
// tapping types the key_takeaway_coded version. Plain text if there's no coded version.
function KeyTakeaway({ text, coded }) {
  if (!text) return null;

  // One code line per line typed in WordPress; lines that start with spaces are indented
  const codedLines = (coded || "")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({
      className:
        "key-takeaway__code" +
        (line.startsWith(" ") ? " key-takeaway__code--indent" : ""),
      segments: toSegments(line.trim()),
    }));

  return (
    <section className="key-takeaway" aria-labelledby="key-takeaway-heading">
      <div className="key-takeaway__inner content-width">
        <h2 id="key-takeaway-heading" className="key-takeaway__label">
          Key takeaway
        </h2>

        {codedLines.length > 0 ? (
          <>
            {/* Screen readers get the plain text; DecodeText is visual only */}
            <p className="visually-hidden">{text}</p>
            <DecodeText
              className="key-takeaway__decode"
              coded={codedLines}
              decoded={[
                { className: "key-takeaway__text", segments: [{ text }] },
              ]}
              startDecoded
              colorShuffle
            />
          </>
        ) : (
          <p className="key-takeaway__text">{text}</p>
        )}
      </div>
    </section>
  );
}

export default KeyTakeaway;
