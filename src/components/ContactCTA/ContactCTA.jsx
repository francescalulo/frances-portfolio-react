import useSiteSettings from "../../hooks/useSiteSettings";
import PayrollLink from "../PayrollLink/PayrollLink";
import GhostLogo from "../GhostLogo/GhostLogo";
import "./ContactCTA.scss";

// "primary" (Home, Work): full-width with the big {f} logo.
// "about" (About, Work Detail): 50/50 split, `aside` fills the left column, no logo.
const HEADINGS = {
  primary: (
    <>
      <span className="contact-cta__line">8hrs of undivided,</span>{" "}
      <span className="contact-cta__line">
        kid-free <strong className="contact-cta__emphasis">focus?</strong>
      </span>
    </>
  ),
  about: (
    <>
      <span className="contact-cta__line">Need I say</span>{" "}
      <span className="contact-cta__line">
        <strong className="contact-cta__emphasis">more?</strong>
      </span>
    </>
  ),
};

// fullScreen (Home): fills one screen with the content centred, like the hero and Featured Work
function ContactCTA({ variant = "primary", aside = null, fullScreen = false }) {
  const { settings } = useSiteSettings();
  const email = settings?.contact_email;
  const ctaText = settings?.cta_text;
  const isSplit = variant === "about";

  return (
    // tabIndex -1: the header's <Contact/> link can move focus here, but it's not a Tab stop
    <section
      id="contact"
      className={
        "contact-cta contact-cta--" +
        variant +
        (fullScreen ? " contact-cta--full" : "")
      }
      aria-labelledby="contact-heading"
      tabIndex={-1}
    >
      {isSplit ? (
        <div className="contact-cta__aside">{aside}</div>
      ) : (
        <GhostLogo layerClassName="contact-cta__mark-layer" />
      )}

      <div
        className={
          isSplit ? "contact-cta__inner" : "contact-cta__inner content-width"
        }
      >
        <h2 id="contact-heading" className="contact-cta__heading">
          {HEADINGS[variant] ?? HEADINGS.primary}
        </h2>

        {ctaText && <p className="contact-cta__text">{ctaText}</p>}

        {email && (
          <PayrollLink className="contact-cta__button">
            Payroll Please <span aria-hidden="true">→</span>
          </PayrollLink>
        )}
      </div>
    </section>
  );
}

export default ContactCTA;
