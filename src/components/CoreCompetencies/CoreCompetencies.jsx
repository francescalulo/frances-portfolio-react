import { useId } from "react";
import useAccordionItem from "../../hooks/useAccordionItem";
import useMediaQuery from "../../hooks/useMediaQuery";
import { DESKTOP_QUERY } from "../../utilities/Utilities";
import "./CoreCompetencies.scss";

// About "Core Competencies": the ACF core_competencies repeater as tags.
// Phones / tablets: a dropdown that starts closed, with a padlock that unlocks when it
// opens and a softly blinking hint. Desktop: the tags are always shown.
function CoreCompetencies({ items }) {
  const isWide = useMediaQuery(DESKTOP_QUERY);
  const { isOpen, itemRef, toggle } = useAccordionItem(false);
  const listId = useId();

  const competencies = (items || [])
    .map((item) => item.competency?.trim())
    .filter(Boolean);
  if (competencies.length === 0) return null;

  const showList = isWide || isOpen;

  return (
    <section
      className="core-competencies"
      aria-labelledby="competencies-heading"
    >
      <div ref={itemRef} className="core-competencies__inner content-width">
        <h2 id="competencies-heading" className="core-competencies__label">
          {isWide ? (
            "Core Competencies"
          ) : (
            <button
              type="button"
              className="core-competencies__toggle"
              aria-expanded={isOpen}
              aria-controls={listId}
              onClick={toggle}
            >
              <span className="core-competencies__toggle-text">
                Core Competencies
                {!isOpen && (
                  <span className="core-competencies__hint" aria-hidden="true">
                    unlock potentials
                  </span>
                )}
              </span>
              <svg
                className="core-competencies__lock"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="5" y="11" width="14" height="10" rx="2" />
                {/* The shackle swings open (unlocked) when the list is open */}
                <path
                  d={
                    isOpen
                      ? "M8 11V7a4 4 0 0 1 7.75-1.4"
                      : "M8 11V7a4 4 0 0 1 8 0v4"
                  }
                />
              </svg>
            </button>
          )}
        </h2>

        <ul id={listId} className="core-competencies__list" hidden={!showList}>
          {competencies.map((competency) => (
            <li key={competency} className="core-competencies__item">
              <span className="core-competencies__dot" aria-hidden="true" />
              {competency}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CoreCompetencies;
