import DecodeText from "../DecodeText/DecodeText";
import { scrollToSection } from "../../utilities/Utilities";
import "./Hero.scss";

// Each line is a <p> with a class; each segment is a coloured <span>
const CODED = [
  {
    className: "hero__code-line",
    segments: [
      { text: "const", className: "hero__keyword" },
      { text: " " },
      { text: "me", className: "hero__string" },
      { text: " " },
      { text: "= {", className: "hero__keyword" },
    ],
  },
  {
    className: "hero__headline",
    segments: [
      { text: "name: '", className: "hero__key" },
      { text: "Frances", className: "hero__value" },
      { text: "',", className: "hero__key" },
    ],
  },
  {
    className: "hero__headline",
    segments: [
      { text: "roles: ['", className: "hero__key" },
      { text: "designer", className: "hero__value" },
      { text: "', '", className: "hero__key" },
      { text: "developer", className: "hero__value" },
      { text: "'],", className: "hero__key" },
    ],
  },
  {
    className: "hero__code-line hero__code-line--superpower",
    segments: [
      { text: "superpower: ( ) =>", className: "hero__keyword" },
      { text: " " },
      {
        text: '"turns coffee into pixels and pixels into code"',
        className: "hero__string",
      },
      { text: ",", className: "hero__key" },
    ],
  },
  {
    className: "hero__code-line",
    segments: [{ text: "};", className: "hero__keyword" }],
  },
];

// The decoded version from the Figma ("Frame 39")
const DECODED = [
  {
    className: "hero__decoded-title",
    segments: [{ text: "Hey I’m Frances." }],
  },
  {
    className: "hero__decoded-title",
    segments: [
      { text: "Designer", className: "hero__designer" },
      { text: " & " },
      { text: "Developer", className: "hero__developer" },
    ],
  },
  {
    className: "hero__decoded-tagline",
    segments: [
      { text: "Turns coffee into pixels and " },
      { text: "pixels into code.", className: "hero__tagline-end" },
    ],
  },
];

function Hero() {
  // Anchor links still work without JS; with JS we scroll smoothly and move focus.
  function jumpTo(event, id) {
    if (scrollToSection(id)) event.preventDefault();
  }

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__inner content-width">
        <p className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true"></span>
          Currently employable
        </p>

        {/* Screen readers get the plain decoded message; DecodeText is visual only */}
        <h1 id="hero-heading" className="visually-hidden">
          Hey, I’m Frances, designer and developer. Turns coffee into pixels and
          pixels into code.
        </h1>

        <DecodeText
          className="hero__code"
          coded={CODED}
          decoded={DECODED}
          toggle
        />

        <div className="hero__actions">
          <a
            href="#about-snippet"
            className="hero__button hero__button--primary"
            onClick={(event) => jumpTo(event, "about-snippet")}
          >
            Fair Warning
          </a>
          <a
            href="#contact"
            className="hero__button hero__button--outline"
            onClick={(event) => jumpTo(event, "contact")}
          >
            Payroll Please
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
