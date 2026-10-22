import "./DecodeSwitch.scss";

// The Decode / Code switch (Home hero, Key Takeaway, About). The knob slides across and the
// label names what pressing it does next. Screen readers hear one label + pressed state.
function DecodeSwitch({
  isDecoded,
  onClick,
  label = "message",
  className = "",
}) {
  return (
    <button
      type="button"
      className={"decode__toggle" + (className ? " " + className : "")}
      aria-pressed={isDecoded}
      aria-label={"Show the decoded " + label}
      onClick={onClick}
    >
      <span className="decode__toggle-knob" aria-hidden="true" />
      <span className="decode__toggle-label" aria-hidden="true">
        {isDecoded ? "Code" : "Decode"}
      </span>
    </button>
  );
}

export default DecodeSwitch;
