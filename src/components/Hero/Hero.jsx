import { scrollToSection } from "../../utilities/Utilities";
import "./Hero.scss";

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

        {/* Screen readers get a plain-language heading; the code-style version below is visual only */}
        <h1 id="hero-heading" className="visually-hidden">
          Frances Calulo, designer and developer. Superpower: turns coffee into
          pixels and pixels into code.
        </h1>

        <div className="hero__code" aria-hidden="true">
          <p className="hero__code-line">
            <span className="hero__keyword">const</span>{" "}
            <span className="hero__string">me</span>{" "}
            <span className="hero__keyword">{"= {"}</span>
          </p>

          <p className="hero__headline">
            <span className="hero__headline-line">
              <span className="hero__key">{"name: '"}</span>
              <span className="hero__value">Frances</span>
              <span className="hero__key">{"',"}</span>
            </span>
            <span className="hero__headline-line">
              <span className="hero__key">{"roles: ['"}</span>
              <span className="hero__value">designer</span>
              <span className="hero__key">{"', '"}</span>
              <span className="hero__value">developer</span>
              <span className="hero__key">{"'],"}</span>
            </span>
          </p>

          <p className="hero__code-line hero__code-line--superpower">
            <span className="hero__keyword">{"superpower: ( ) =>"}</span>{" "}
            <span className="hero__string">
              {'"turns coffee into pixels and pixels into code"'}
            </span>
            <span className="hero__key">,</span>
          </p>

          <p className="hero__code-line">
            <span className="hero__keyword">{"};"}</span>
          </p>
        </div>

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
