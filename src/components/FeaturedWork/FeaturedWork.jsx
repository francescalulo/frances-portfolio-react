import { Link } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import WorkCard from "../WorkCard/WorkCard";
import "./FeaturedWork.scss";

// Home's Work preview. The project ticked "Home Featured" in WordPress
// gets the big panel; the rest go in the right column. Desktop: the left column sticks for
// one screen while the page scrolls the other projects past it.
// Phones/tablets show the featured project plus one more, then "View all works".
function FeaturedWork() {
  const { projects, isLoaded, hasError } = useProjects(); // shared with the Work archive

  // No project ticked? Fall back to the first one so the panel is never empty.
  const featured =
    projects.find((project) => project.acf?.home_featured) ?? projects[0];
  const others = projects.filter((project) => project !== featured);

  return (
    <section
      id="featured-work"
      className="featured-work"
      aria-labelledby="featured-work-heading"
      tabIndex={-1}
      data-rails="false"
    >
      <div className="featured-work__inner content-width">
        {/* Left column: sticks on desktop while the other projects scroll past */}
        <div className="featured-work__main">
          <div className="featured-work__head">
            <p className="featured-work__label">
              <span aria-hidden="true">{"// "}</span>
              Featured Work
            </p>
            <h2 id="featured-work-heading" className="featured-work__title">
              The Receipts
            </h2>
          </div>

          {!isLoaded && (
            <p className="featured-work__status" role="status">
              Loading work…
            </p>
          )}

          {isLoaded && hasError && (
            <p className="featured-work__status">
              Work couldn’t load right now. Please try again later.
            </p>
          )}

          {isLoaded && !hasError && featured && (
            <div className="featured-work__featured">
              <WorkCard project={featured} isFeatured />
            </div>
          )}
        </div>

        {/* Other projects. Desktop: right column, two per screen. Phones: just the first one */}
        {others.length > 0 && (
          <ul className="featured-work__list" aria-label="More work">
            {others.map((project) => (
              <li key={project.id}>
                <WorkCard project={project} />
              </li>
            ))}
          </ul>
        )}

        {/* Phones/tablets only (hidden on desktop, where every project is already showing) */}
        <Link to="/work" className="featured-work__more">
          View all works <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedWork;
