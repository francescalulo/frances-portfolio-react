import "./ScrambleText.scss";

// Shows the scrambling text visually, but screen readers only get the real text.
// An invisible copy reserves the real width so nothing shifts while it scrambles.
function ScrambleText({ text, display, label }) {
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
