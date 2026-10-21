import { decodeHtml, getTerms } from "../../utilities/Utilities";
import "./WorkMeta.scss";

// Term names for one taxonomy, e.g. ["JavaScript", "React"]
function termNames(project, taxonomy) {
  return getTerms(project, taxonomy).map((term) => decodeHtml(term.name));
}

// Project With / Build / Tech Stack / Role. Phones: a list under the title.
// Desktop: a strip of four columns above the title (WorkDetailPage moves it up).
// Terms are a small list, so the "|" between them can be styled (and isn't read out).
function WorkMeta({ project, className = "" }) {
  const items = [
    { label: "Project with", terms: termNames(project, "collaboration") },
    { label: "Build", terms: termNames(project, "build") },
    { label: "Tech stack", terms: termNames(project, "tech-stack") },
    { label: "Role", text: project.acf?.role },
  ].filter((item) => item.text || item.terms?.length); // skip anything not filled in yet

  if (items.length === 0) return null;

  return (
    <div className={"work-meta " + className}>
      <dl className="work-meta__list content-width">
        {items.map((item) => (
          <div key={item.label} className="work-meta__item">
            <dt className="work-meta__label">{item.label}</dt>
            <dd className="work-meta__value">
              {item.terms ? (
                <ul className="work-meta__terms">
                  {item.terms.map((name) => (
                    <li key={name} className="work-meta__term">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                item.text
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default WorkMeta;
