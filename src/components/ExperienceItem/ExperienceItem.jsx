import { useEffect, useId, useRef } from "react";
import DOMPurify from "dompurify";
import useMediaQuery from "../../hooks/useMediaQuery";
import { DESKTOP_QUERY } from "../../utilities/Utilities";
import "./ExperienceItem.scss";

// Turns the ACF "years_in_role" text (e.g. "2007–2019", "2023–present") into "10+ years".
// Rounds DOWN to the nearest 5 so the "+" stays true; under 5 years shows the real number.
function formatYears(range) {
  const found = String(range || "").match(/\d{4}/g);
  if (!found) return null;

  const start = Number(found[0]);
  const end =
    found.length > 1
      ? Number(found[found.length - 1])
      : new Date().getFullYear();
  const total = end - start;
  if (total < 1) return null;

  const rounded = total >= 5 ? Math.floor(total / 5) * 5 : total;
  return `${rounded}+ ${rounded === 1 ? "year" : "years"}`;
}

// One career chapter from the Experience CPT.
// Phones/tablets: accordion, one open at a time (AboutSnippet decides which one is open).
// Desktop: always open, plain heading, no button (as in the hi-fi).
function ExperienceItem({ chapter, isOpen, onToggle }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const panelId = useId();
  const headerRef = useRef(null);
  const openedByTap = useRef(false);
  const showPanel = isDesktop || isOpen;

  // After a tap opens this chapter (and closes the one above), keep its title on screen
  useEffect(() => {
    if (!isOpen || !openedByTap.current) return;
    openedByTap.current = false;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    headerRef.current?.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [isOpen]);

  function handleToggle() {
    openedByTap.current = !isOpen;
    onToggle();
  }

  const {
    location,
    years_in_role: yearsInRole,
    story,
    skills_gained: skills,
  } = chapter.acf;
  const years = formatYears(yearsInRole);
  const skillList = skills || []; // ACF returns false for an empty repeater

  const title = (
    <span
      className="experience-item__title"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(chapter.title.rendered),
      }}
    />
  );
  const yearsLabel = years && (
    <span className="experience-item__years">{years}</span>
  );

  return (
    <div className={`experience-item${showPanel ? " is-open" : ""}`}>
      <h3 className="experience-item__heading" ref={headerRef}>
        {isDesktop ? (
          <span className="experience-item__header">
            {title}
            {yearsLabel}
          </span>
        ) : (
          <button
            type="button"
            className="experience-item__header experience-item__toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={handleToggle}
          >
            {title}
            {yearsLabel}
            <svg
              className="experience-item__chevron"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </h3>

      <div id={panelId} className="experience-item__body" hidden={!showPanel}>
        {location && (
          <p className="experience-item__location">
            <svg
              className="experience-item__pin"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </p>
        )}

        {story && (
          <div
            className="experience-item__story"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story) }}
          />
        )}

        {skillList.length > 0 && (
          <ul className="experience-item__skills" aria-label="Skills gained">
            {skillList.map((item, index) => (
              <li
                key={`${item.skill}-${index}`}
                className="experience-item__skill"
              >
                {item.skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExperienceItem;
