import { Link } from "react-router-dom";
import "./WorkCard.scss";

// Image sizes WordPress makes, smallest first (used to build srcSet)
const IMAGE_SIZES = ["medium", "medium_large", "large", "full"];

// One Work project as a card. The whole card is clickable (the title link stretches over it),
// but only the title is a real link, so screen readers hear each project once.
// Reused later on the Work archive (pass headingLevel={2} there if the cards sit under the h1).
function WorkCard({ project, isFeatured = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const media = project._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes ?? {};
  const srcSet = IMAGE_SIZES.map((name) => sizes[name])
    .filter(Boolean)
    .map((size) => `${size.source_url} ${size.width}w`)
    .join(", ");

  return (
    <article className={`work-card${isFeatured ? " work-card--featured" : ""}`}>
      <div className="work-card__media">
        {media?.source_url ? (
          // Decorative: the title already names the project
          <img
            className="work-card__image"
            src={media.source_url}
            srcSet={srcSet || undefined}
            sizes={
              isFeatured
                ? "(min-width: 64em) 60vw, 100vw"
                : "(min-width: 64em) 30vw, 100vw"
            }
            width={media.media_details?.width}
            height={media.media_details?.height}
            alt=""
            loading={isFeatured ? "eager" : "lazy"}
          />
        ) : (
          <div className="work-card__placeholder" aria-hidden="true">
            <svg
              className="work-card__placeholder-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
            </svg>
            <span>Image coming soon</span>
          </div>
        )}
      </div>

      <div className="work-card__body">
        <div className="work-card__top">
          <Heading className="work-card__title">
            <Link
              to={`/work/${project.slug}`}
              className="work-card__link"
              dangerouslySetInnerHTML={{ __html: project.title.rendered }}
            />
          </Heading>
          {project.acf?.project_type && (
            <p className="work-card__type">{project.acf.project_type}</p>
          )}
        </div>

        {project.excerpt?.rendered && (
          <div
            className="work-card__excerpt"
            dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
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
