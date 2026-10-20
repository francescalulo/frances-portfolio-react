import { useSearchParams } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import WorkRow from "../../components/WorkRow/WorkRow";
import Loader from "../../components/Loader/Loader";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import { decodeHtml, getTerms } from "../../utilities/Utilities";
import "./WorkPage.scss";

// Work archive ("The Build"): every project, filterable by Category (work-category).
// The chosen filter lives in the URL (/work?category=web-app), so it can be shared or
// bookmarked and the Back button undoes it. All projects come in one request (shared
// with Home), so filtering is instant and needs no extra requests.
function WorkPage() {
  const { projects, isLoaded, hasError } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category"); // a category slug, or null for All

  // Filter buttons: every category used by at least one project, in WordPress term order
  const categories = [
    ...new Map(
      projects
        .flatMap((project) => getTerms(project, "work-category"))
        .map((term) => [term.id, term]),
    ).values(),
  ].sort((a, b) => a.id - b.id);

  const activeCategory = categories.find((term) => term.slug === active);

  // Each project keeps its number from the full list (01–04), even when filtered
  const numbered = projects.map((project, index) => ({
    project,
    number: index + 1,
  }));
  const shown = activeCategory
    ? numbered.filter(({ project }) =>
        getTerms(project, "work-category").some(
          (term) => term.id === activeCategory.id,
        ),
      )
    : numbered;

  function choose(slug) {
    // replace: switching filters doesn't pile up Back-button history entries
    setSearchParams(slug ? { category: slug } : {}, { replace: true });
  }

  const countLabel =
    shown.length + (shown.length === 1 ? " project" : " projects");

  return (
    <>
      <title>The Build | Frances Calulo</title>

      <section className="work-intro" aria-labelledby="work-heading">
        <div className="work-intro__inner content-width">
          <p className="work-intro__label">
            <span aria-hidden="true">{"// "}</span>
            Work Archive
          </p>
          <h1 id="work-heading" className="work-intro__title">
            The Build
          </h1>

          {categories.length > 0 && (
            <div
              className="work-intro__filters"
              role="group"
              aria-label="Filter projects by category"
            >
              <button
                type="button"
                className="work-intro__filter"
                aria-pressed={!activeCategory}
                onClick={() => choose(null)}
              >
                All
              </button>
              {categories.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  className="work-intro__filter"
                  aria-pressed={activeCategory?.id === term.id}
                  onClick={() => choose(term.slug)}
                >
                  {decodeHtml(term.name)}
                </button>
              ))}
            </div>
          )}

          {/* Screen readers hear how many projects the filter shows */}
          <p className="visually-hidden" role="status">
            {isLoaded && !hasError
              ? "Showing " +
                countLabel +
                (activeCategory ? " in " + decodeHtml(activeCategory.name) : "")
              : ""}
          </p>
        </div>
      </section>

      <section className="work-list" aria-label="Projects">
        {/* Always on the page, so screen readers announce loading, errors and empty results */}
        <div className="work-list__status content-width" role="status">
          {!isLoaded && <Loader code="fetching(work)…" label="Loading work…" />}

          {isLoaded && hasError && (
            <p className="work-list__error">
              The work didn’t render. Not my code, obviously. The server dropped
              the ball. Refresh, or check back in a bit.
            </p>
          )}

          {isLoaded && !hasError && shown.length === 0 && (
            <p>
              Nothing’s rendered here yet. Shocking, I know. Try another
              category.
            </p>
          )}
        </div>

        {shown.length > 0 && (
          <ol className="work-list__items">
            {shown.map(({ project, number }) => (
              <li key={project.id}>
                <WorkRow project={project} number={number} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <ContactCTA />
    </>
  );
}

export default WorkPage;
