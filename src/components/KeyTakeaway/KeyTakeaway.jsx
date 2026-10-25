import { toCodeSegments } from "../../utilities/Utilities";
import DecodeText from "../DecodeText/DecodeText";
import "./KeyTakeaway.scss";

// Work Detail "Key Takeaway": the ACF key_takeaway text, decoded by default, each sentence
// on its own line; hovering / tapping, or the Code / Decode switch, types the
// key_takeaway_coded version. Plain text (no switch) if there's no coded version.
function KeyTakeaway({ text, coded }) {
  if (!text) return null;

  // Each sentence starts its own line
  const sentences = text.trim().split(/(?<=[.!?])\s+/);

  // One code line per line typed in WordPress; lines that start with spaces are indented
  const codedLines = (coded || "")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({
      className:
        "key-takeaway__code" +
        (line.startsWith(" ") ? " key-takeaway__code--indent" : ""),
      segments: toCodeSegments(line.trim(), "key-takeaway"),
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
              decoded={sentences.map((sentence) => ({
                className: "key-takeaway__text",
                segments: [{ text: sentence }],
              }))}
              startDecoded
              colorShuffle
              toggle
            />
          </>
        ) : (
          sentences.map((sentence, index) => (
            <p key={index} className="key-takeaway__text">
              {sentence}
            </p>
          ))
        )}
      </div>
    </section>
  );
}

export default KeyTakeaway;
