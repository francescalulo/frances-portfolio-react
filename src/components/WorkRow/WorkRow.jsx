import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import ProjectImage from "../ProjectImage/ProjectImage";
import { decodeHtml, getTerms } from "../../utilities/Utilities";
import "./WorkRow.scss";

// One project on the Work archive (hi-fi "Project-Row").
// Desktop: three columns: number + Build tags + title | excerpt + year, categories and
// "Project with SOLO/TEAM" | image + Live Site link. Phones/tablets: a card, image first.
// The title link stretches over the whole row; Live Site sits above it as its own link.
function WorkRow({ project, number }) {
  const title = decodeHtml(project.title.rendered);
  const builds = getTerms(project, "build");
  const categories = getTerms(project, "work-category");
  const [collaboration] = getTerms(project, "collaboration");
  const year = new Date(project.date).getFullYear();
  const liveUrl = project.acf?.live_site_url;

  return (
    <article className="work-row">
      <div className="work-row__inner content-width">
        <div className="work-row__body">
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
                {title}
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
