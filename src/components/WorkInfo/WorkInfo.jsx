import { useEffect, useId, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { revealInView } from "../../utilities/Utilities";
import "./WorkInfo.scss";

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "challenge", label: "Challenge" },
  { key: "approach", label: "Approach" },
];

// One row: the label is a button that opens and closes its text.
// Opening it by click scrolls the page so the whole row is on screen.
function WorkInfoItem({ label, html, sidenote, isOpenAtStart }) {
  const [isOpen, setIsOpen] = useState(isOpenAtStart);
  const panelId = useId();
  const itemRef = useRef(null);
  const openedByClick = useRef(false);

  useEffect(() => {
    if (!isOpen || !openedByClick.current) return;
    openedByClick.current = false;
    revealInView(itemRef.current);
  }, [isOpen]);

  function handleToggle() {
    openedByClick.current = !isOpen;
    setIsOpen(!isOpen);
  }

  return (
    <div
      ref={itemRef}
      className={"work-info__item" + (isOpen ? " is-open" : "")}
    >
      <h2 className="work-info__heading">
        <button
          type="button"
          className="work-info__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
        >
          {label}
          <svg
            className="work-info__chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </h2>

      <div id={panelId} className="work-info__panel" hidden={!isOpen}>
        <div
          className="work-info__text"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
        />
        {sidenote && (
          <p className="work-info__sidenote">
            <span className="work-info__sidenote-label">Side note:</span>{" "}
            {sidenote}
          </p>
        )}
      </div>
    </div>
  );
}

// Overview / Challenge / Approach from the ACF "work_info" group. Each opens on its
// own; Overview starts open. Empty sections are skipped.
function WorkInfo({ info }) {
  const sections = SECTIONS.filter((section) => info?.[section.key]);
  if (sections.length === 0) return null;

  return (
    <div className="work-info content-width">
      {sections.map((section, index) => (
        <WorkInfoItem
          key={section.key}
          label={section.label}
          html={info[section.key]}
          sidenote={section.key === "approach" ? info.approach_sidenote : null}
          isOpenAtStart={index === 0}
        />
      ))}
    </div>
  );
}

export default WorkInfo;
