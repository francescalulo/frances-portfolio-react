import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restBase } from "../../utilities/Utilities";
import DecodeText from "../DecodeText/DecodeText";
import ExperienceItem from "../ExperienceItem/ExperienceItem";
import "./AboutSnippet.scss";

// Code line breaks: BREAK is an invisible "you may wrap here" spot (after natural code
// joins like .filter); NBSP is a space that never wraps, so "( )" always stays together
const BREAK = "\u200B";
const NBSP = "\u00A0";

// About statement: decoded by default (dev plan 1.3); hover / tap types the code.
// Small lines frame the code, large lines carry the meaning (same idea as the hero).
const STATEMENT = [
  {
    className: "about-snippet__statement",
    segments: [{ text: "Chaos wrangler by necessity, meticulous by design," }],
  },
  {
    className: "about-snippet__statement",
    segments: [{ text: "expert over-thinker by default." }],
  },
];

// Wrap points on phones: only after "{ " / "; " / "= " (normal spaces); every other space
// is NBSP so the code never splits in an odd place
const STATEMENT_CODE = [
  {
    className: "about-snippet__code-line",
    segments: [
      { text: "class", className: "about-snippet__kw" },
      { text: " " },
      { text: "ActiveInstance", className: "about-snippet__id" },
      { text: " {", className: "about-snippet__kw" },
    ],
  },
  {
    className: "about-snippet__code-line about-snippet__indent-1",
    segments: [
      {
        text: "/* still running, no crashes reported */",
        className: "about-snippet__comment",
      },
    ],
  },
  {
    className: "about-snippet__code-line about-snippet__indent-1",
    segments: [{ text: "constructor(", className: "about-snippet__kw" }],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-2",
    segments: [
      { text: "chaos", className: "about-snippet__value" },
      {
        text: `${NBSP}=${NBSP}((${NBSP})${NBSP}`,
        className: "about-snippet__key",
      },
      { text: "=>", className: "about-snippet__kw" },
      { text: `${NBSP}{ `, className: "about-snippet__key" },
      { text: "throw", className: "about-snippet__kw" },
      { text: NBSP },
      { text: "new", className: "about-snippet__kw" },
      {
        text: `${NBSP}Error(${NBSP}); })(${NBSP}),`,
        className: "about-snippet__key",
      },
    ],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-2",
    segments: [
      { text: `overthinker${NBSP}= "`, className: "about-snippet__key" },
      { text: "expert", className: "about-snippet__value" },
      { text: '"', className: "about-snippet__key" },
    ],
  },
  {
    className: "about-snippet__code-line about-snippet__indent-1",
    segments: [
      { text: ") {", className: "about-snippet__kw" },
      { text: " Object.assign(" },
      { text: "this", className: "about-snippet__kw" },
      { text: ", { " },
      { text: "chaos, overthinker", className: "about-snippet__key" },
      { text: " }); " },
      { text: "}", className: "about-snippet__kw" },
    ],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-1",
    segments: [
      { text: "get", className: "about-snippet__kw" },
      { text: NBSP },
      { text: "meticulous", className: "about-snippet__value" },
      { text: `(${NBSP})${NBSP}{ `, className: "about-snippet__key" },
      { text: "return", className: "about-snippet__kw" },
      { text: NBSP },
      { text: "true", className: "about-snippet__kw" },
      { text: `;${NBSP}}`, className: "about-snippet__key" },
    ],
  },
  {
    className: "about-snippet__code-line",
    segments: [{ text: "}", className: "about-snippet__kw" }],
  },
];

// Plot Twist: decoded by default (dev plan 1.5), same interaction as the statement
const PLOT_TWIST = [
  {
    className: "about-snippet__statement about-snippet__statement--twist",
    segments: [
      {
        text: `None of these experiences were detours, just the same skills translating into new${NBSP}languages.`,
      },
    ],
  },
];

const PLOT_TWIST_CODE = [
  {
    className: "about-snippet__code-line",
    segments: [
      { text: "const", className: "about-snippet__kw" },
      { text: " " },
      { text: "experiences", className: "about-snippet__id" },
      { text: " = [design, retail, code];", className: "about-snippet__kw" },
    ],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-1",
    segments: [
      {
        text: `experiences${BREAK}.filter(isDetour)${BREAK}.length${NBSP}`,
        className: "about-snippet__key",
      },
      { text: "===", className: "about-snippet__kw" },
      { text: NBSP },
      { text: "0", className: "about-snippet__value" },
      { text: ";", className: "about-snippet__key" },
    ],
  },
  {
    className: "about-snippet__code-line",
    segments: [
      { text: "experiences.forEach((role) " },
      { text: "=>", className: "about-snippet__kw" },
      { text: " {", className: "about-snippet__kw" },
    ],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-2",
    segments: [
      { text: "role.", className: "about-snippet__key" },
      { text: "skills", className: "about-snippet__value" },
      {
        text: `${BREAK}.translateTo(${BREAK}`,
        className: "about-snippet__key",
      },
      { text: "newLanguage", className: "about-snippet__value" },
      { text: ");", className: "about-snippet__key" },
    ],
  },
  {
    className: "about-snippet__code-big about-snippet__indent-2",
    segments: [
      { text: "role.", className: "about-snippet__key" },
      { text: "lessons", className: "about-snippet__value" },
      {
        text: `${BREAK}.carryForward(${NBSP});`,
        className: "about-snippet__key",
      },
    ],
  },
  {
    className: "about-snippet__code-line",
    segments: [{ text: "});", className: "about-snippet__kw" }],
  },
];

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
          {/* Screen readers get the plain heading; DecodeText is visual only */}
          <h2 id="about-snippet-heading" className="visually-hidden">
            Chaos wrangler by necessity, meticulous by design, expert
            over-thinker by default.
          </h2>
          <DecodeText
            className="about-snippet__decode"
            coded={STATEMENT_CODE}
            decoded={STATEMENT}
            startDecoded
            colorShuffle
          />
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
              Career chapters couldn’t load right now. Please try again later.
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
          {/* Screen readers get the plain text; DecodeText is visual only */}
          <p className="visually-hidden">
            None of these experiences were detours, just the same skills
            translating into new languages.
          </p>
          <DecodeText
            className="about-snippet__decode"
            coded={PLOT_TWIST_CODE}
            decoded={PLOT_TWIST}
            startDecoded
            colorShuffle
          />
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
