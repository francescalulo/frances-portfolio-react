import { useRef } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import ProjectImage from "../ProjectImage/ProjectImage";
import "./WorkCard.scss";

// One Work project as a card (Home's Featured Work). The whole card is clickable (the title
// link stretches over it), but only the title is a real link, so screen readers hear each
// project once. WordPress HTML (title, excerpt) is sanitized before it's rendered.
// Hovering the card (or focusing its link): the image glitches, like the About photo.
// Touch screens: it glitches as it scrolls into view. Reduced motion: no glitch.
function WorkCard({ project, isFeatured = false, headingLevel = 3 }) {
  const Heading = "h" + headingLevel;
  const imageRef = useRef(null);

  function play() {
    imageRef.current?.glitch();
  }

  return (
    <article
      className={"work-card" + (isFeatured ? " work-card--featured" : "")}
      onMouseEnter={play}
      onFocus={play}
    >
      <ProjectImage
        project={project}
        className="work-card__media"
        sizes={
          isFeatured
            ? "(min-width: 64em) 60vw, 100vw"
            : "(min-width: 64em) 30vw, 100vw"
        }
        isEager={isFeatured}
        glitch
        ref={imageRef}
      />

      <div className="work-card__body">
        <div className="work-card__top">
          <Heading className="work-card__title">
            <Link
              to={"/work/" + project.slug}
              className="work-card__link"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(project.title.rendered),
              }}
            />
          </Heading>
          {project.acf?.project_type && (
            <p className="work-card__type">{project.acf.project_type}</p>
          )}
        </div>

        {project.excerpt?.rendered && (
          <div
            className="work-card__excerpt"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(project.excerpt.rendered),
            }}
          />
        )}

        {/* Visual cue only: the title link above is what screen readers get */}
        <p className="work-card__cta" aria-hidden="true">
          View project <span className="work-card__arrow">→</span>
        </p>
      </div>
    </article>
  );
}

export default WorkCard;
