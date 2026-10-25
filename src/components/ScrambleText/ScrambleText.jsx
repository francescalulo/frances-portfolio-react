import "./ScrambleText.scss";

// Shows the scrambling text visually, but screen readers only get the real text.
// An invisible copy reserves the real width so nothing shifts while it scrambles.
// wrap: for longer text (titles) that may break onto more lines. Each word gets its own
// copies (spaces never scramble), so the lines break the same way while it shuffles.
function ScrambleText({ text, display, label, wrap = false }) {
  if (wrap) {
    const shownWords = display.split(" ");
    return (
      <span>
        <span aria-hidden="true">
          {text.split(" ").map((word, index) => (
            <span key={index}>
              {index > 0 && " "}
              <span className="scramble">
                <span className="scramble__sizer">{word}</span>
                <span className="scramble__display">
                  {shownWords[index] ?? word}
                </span>
              </span>
            </span>
          ))}
        </span>
        <span className="visually-hidden">{label ?? text}</span>
      </span>
    );
  }

  return (
    <span className="scramble">
      <span className="scramble__sizer" aria-hidden="true">
        {text}
      </span>
      <span className="scramble__display" aria-hidden="true">
        {display}
      </span>
      <span className="visually-hidden">{label ?? text}</span>
    </span>
  );
}

export default ScrambleText;
