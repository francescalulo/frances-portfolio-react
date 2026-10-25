import { useRef } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import useScramble from "../../hooks/useScramble";
import ProjectImage from "../ProjectImage/ProjectImage";
import ScrambleText from "../ScrambleText/ScrambleText";
import { decodeHtml, getTerms, safeUrl } from "../../utilities/Utilities";
import "./WorkRow.scss";

// One project on the Work archive ("Project-Row").
// Desktop: three columns: number + Build tags + title | excerpt + year, categories and
// "Project with SOLO/TEAM" | image + Live Site link. Phones/tablets: a card, image first.
// The title link stretches over the whole row; Live Site sits above it as its own link.
// Hovering the row (or focusing its links): the title shuffles and glitches, like the
// Work Detail title, and the image glitches, like the About photo. Touch screens: the
// image glitches as it scrolls into view. Reduced motion: neither.
function WorkRow({ project, number }) {
  const title = decodeHtml(project.title.rendered);
  const { display, scramble, isScrambling } = useScramble(title, {
    duration: 800,
    band: 6,
  });
  const imageRef = useRef(null);
  const builds = getTerms(project, "build");
  const categories = getTerms(project, "work-category");
  const [collaboration] = getTerms(project, "collaboration");
  const year = new Date(project.date).getFullYear();
  const liveUrl = safeUrl(project.acf?.live_site_url);

  function play() {
    scramble();
    imageRef.current?.glitch();
  }

  return (
    <article className="work-row">
      <div className="work-row__inner content-width">
        <div className="work-row__body" onMouseEnter={play} onFocus={play}>
          <div className="work-row__intro">
            <div className="work-row__index">
              <span className="work-row__number">
                {String(number).padStart(2, "0")}
              </span>
              {builds.length > 0 && (
                <ul className="work-row__tags" aria-label="Built with">
                  {builds.map((term) => (
                    <li key={term.id} className="work-row__tag">
                      {decodeHtml(term.name)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h2 className="work-row__title">
              <Link to={"/work/" + project.slug} className="work-row__link">
                <span
                  className={
                    "work-row__title-text glitch-text" +
                    (isScrambling ? " is-glitching" : "")
                  }
                >
                  <ScrambleText text={title} display={display} wrap />
                </span>
              </Link>
            </h2>
          </div>

          <div className="work-row__info">
            {project.excerpt?.rendered && (
              <div
                className="work-row__excerpt"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(project.excerpt.rendered),
                }}
              />
            )}

            <div className="work-row__meta">
              <p className="work-row__categories">
                <span>{year}</span>
                {categories.map((term) => (
                  <span key={term.id}>{decodeHtml(term.name)}</span>
                ))}
              </p>
              {collaboration && (
                <p className="work-row__collab">
                  Project with{" "}
                  <span className="work-row__collab-type">
                    {decodeHtml(collaboration.name)}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="work-row__media">
            <ProjectImage
              project={project}
              className="work-row__image"
              sizes="(min-width: 64em) 30vw, (min-width: 48em) 45vw, 100vw"
              isEager={number === 1}
              glitch
              ref={imageRef}
            />
            {liveUrl && (
              <a
                href={liveUrl}
                className="work-row__live"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site <span aria-hidden="true">→</span>
                <span className="visually-hidden">
                  {" "}
                  for {title} (opens in a new tab)
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default WorkRow;
