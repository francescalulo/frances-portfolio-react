import { Link } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";
import DecodeText from "../../components/DecodeText/DecodeText";
import "../../components/Hero/Hero.scss"; // same layout and syntax colours as the Home hero
import "./NotFoundPage.scss";

// Each line is a <p> with a class; each segment is a coloured <span>
const CODED = [
  {
    className: "hero__code-line",
    segments: [
      { text: "const", className: "hero__keyword" },
      { text: " " },
      { text: "page", className: "hero__string" },
      { text: " " },
      { text: "= {", className: "hero__keyword" },
    ],
  },
  {
    className: "hero__headline",
    segments: [
      { text: "status: ", className: "hero__key" },
      { text: "404", className: "hero__value" },
      { text: ",", className: "hero__key" },
    ],
  },
  {
    className: "hero__headline",
    segments: [
      { text: "found: ", className: "hero__key" },
      { text: "false", className: "hero__value" },
      { text: ",", className: "hero__key" },
    ],
  },
  {
    className: "hero__code-line hero__code-line--superpower",
    segments: [
      { text: "fix: (\u00A0) =>", className: "hero__keyword" },
      { text: " " },
      { text: '"head back to TheLounge"', className: "hero__string" },
      { text: ",", className: "hero__key" },
    ],
  },
  {
    className: "hero__code-line",
    segments: [{ text: "};", className: "hero__keyword" }],
  },
];

// The decoded (readable) version
const DECODED = [
  {
    className: "hero__decoded-title",
    segments: [{ text: "404.", className: "hero__developer" }],
  },
  {
    className: "hero__decoded-title",
    segments: [{ text: "This page didn’t render." }],
  },
  {
    className: "hero__decoded-tagline",
    segments: [
      { text: "Wrong address, or it moved. " },
      { text: "Not my code, obviously.", className: "hero__tagline-end" },
    ],
  },
];

// Unknown addresses (and unknown /work/ projects): the Home hero, as an error.
// Kept out of search results (noIndex).
function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page Not Found | Frances Calulo" noIndex />

      <section className="hero not-found" aria-labelledby="not-found-heading">
        <div className="hero__inner content-width">
          <p className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true"></span>
            Error 404
          </p>

          {/* Screen readers get the plain decoded message; DecodeText is visual only */}
          <h1 id="not-found-heading" className="visually-hidden">
            404: This page didn’t render. Wrong address, or it moved.
          </h1>

          <DecodeText
            className="hero__code"
            coded={CODED}
            decoded={DECODED}
            toggle
          />

          <div className="hero__actions">
            <Link to="/" className="hero__button hero__button--primary">
              Back to TheLounge
            </Link>
            <Link to="/work" className="hero__button hero__button--outline">
              See TheBuild
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
