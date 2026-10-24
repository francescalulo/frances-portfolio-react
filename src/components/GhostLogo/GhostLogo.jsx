import logoGhost from "../../assets/frances-logo-ghost.svg";
import "./GhostLogo.scss";

// The big faded {f} logo, decoration only (Contact CTA, mobile menu). It covers its
// section and clips the logo, glowing against the purple. Two copies make the
// progressive blur: sharp at the top-left, blurred toward the bottom-right.
// layerClassName places and sizes the logo inside its section.
function GhostLogo({ layerClassName }) {
  return (
    <div className="ghost-logo" aria-hidden="true">
      <img
        src={logoGhost}
        alt=""
        className={
          "ghost-logo__layer ghost-logo__layer--sharp " + layerClassName
        }
        width="609"
        height="443"
      />
      <img
        src={logoGhost}
        alt=""
        className={
          "ghost-logo__layer ghost-logo__layer--blur " + layerClassName
        }
        width="609"
        height="443"
      />
    </div>
  );
}

export default GhostLogo;
