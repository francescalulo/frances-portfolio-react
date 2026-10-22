import { Link } from "react-router-dom";
import "./NextUp.scss";

// Two digits, like the nav numbers: 2 → "02"
const pad = (number) => String(number).padStart(2, "0");

// Work Detail: the next project (from the next_project REST field), shown in the left
// half of the Contact CTA. The whole title + type is one link; it loops back to the first.
function NextUp({ next }) {
  if (!next?.slug) return null;

  return (
    <div className="next-up">
      <div className="next-up__header">
        <h2 className="next-up__label">Next up</h2>
        <p className="next-up__count">
          <span aria-hidden="true">
            {pad(next.position) + " / " + pad(next.total)}
          </span>
          <span className="visually-hidden">
            {"Project " + next.position + " of " + next.total}
          </span>
        </p>
      </div>

      <Link to={"/work/" + next.slug} className="next-up__link">
        <span className="next-up__title">{next.title}</span>
        {next.project_type && (
          <span className="next-up__type">
            {next.project_type} <span aria-hidden="true">→</span>
          </span>
        )}
      </Link>
    </div>
  );
}

export default NextUp;
