import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restBase } from "../../utilities/Utilities";
import ExperienceItem from "../ExperienceItem/ExperienceItem";
import "./AboutSnippet.scss";

// Home's About teaser. The large copy is hardcoded (per the plan); career chapters come from the Experience CPT.
// id="about-snippet" is the target of the hero's "Fair Warning" button.
function AboutSnippet() {
  const [chapters, setChapters] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // set once chapters load

  useEffect(() => {
    let isActive = true; // ignore the result if the page changes first

    fetch(
      `${restBase}experience?orderby=menu_order&order=asc&acf_format=standard&_fields=id,title,acf`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Experience request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (isActive) {
          setChapters(data);
          setOpenIndex(data.length - 1); // phones: open the latest chapter (Front-end) first
        }
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      id="about-snippet"
      className="about-snippet"
      aria-labelledby="about-snippet-heading"
      tabIndex={-1}
    >
      <div className="about-snippet__inner content-width">
        <div className="about-snippet__block">
          <p className="about-snippet__label">
            <span aria-hidden="true">{"// "}</span>
            Quick Disclaimer:{" "}
            <span className="about-snippet__label-note">
              Mom of three, twin toddlers included
            </span>
          </p>
          <h2 id="about-snippet-heading" className="about-snippet__statement">
            <span className="about-snippet__line">
              Chaos wrangler by necessity, meticulous by design,
            </span>{" "}
            <span className="about-snippet__line">
              expert over-thinker by default.
            </span>
          </h2>
        </div>

        <div className="about-snippet__block about-snippet__block--chapters">
          <p className="about-snippet__label about-snippet__label--bold">
            <span aria-hidden="true">{"// "}</span>
            Career chapters
          </p>

          {!isLoaded && (
            <p className="about-snippet__status" role="status">
              Loading career chapters…
            </p>
          )}

          {isLoaded && hasError && (
            <p className="about-snippet__status">
              Career chapters couldn't load right now. Please try again later.
            </p>
          )}

          {isLoaded && !hasError && (
            <ol className="about-snippet__chapters">
              {chapters.map((chapter, index) => (
                <li key={chapter.id}>
                  {/* Phones: one chapter open at a time; tapping the open one closes it */}
                  <ExperienceItem
                    chapter={chapter}
                    isOpen={openIndex === index}
                    onToggle={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="about-snippet__block">
          <p className="about-snippet__label about-snippet__label--bold">
            <span aria-hidden="true">{"// "}</span>
            Plot Twist
          </p>
          <p className="about-snippet__statement about-snippet__statement--twist">
            None of these experiences were detours, just the same skills
            translating into new languages.
          </p>
        </div>

        <Link to="/about" className="about-snippet__more">
          Full disclosure <span aria-hidden="true">→</span>
          <span className="visually-hidden"> (About page)</span>
        </Link>
      </div>
    </section>
  );
}

export default AboutSnippet;
