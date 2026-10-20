import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logoGhost from "../../assets/frances-logo-ghost.svg";
import useScramble from "../../hooks/useScramble";
import useSiteSettings from "../../hooks/useSiteSettings";
import ScrambleText from "../ScrambleText/ScrambleText";
import { PLATFORM_LABELS } from "../../utilities/Utilities";
import "./MobileMenu.scss";

const STAGGER = 90; // ms between each link's scramble
const START = 200; // ms, matches the CSS slide-in delay of the first link

// One menu link. It scrambles in shortly after the menu opens (skipped with reduced motion).
function MenuLink({ number, label, srLabel, to, onClick, delay }) {
  const { display, scramble } = useScramble(label);

  useEffect(() => {
    const timer = setTimeout(scramble, delay);
    return () => clearTimeout(timer);
  }, [scramble, delay]);

  const content = (
    <>
      <span className="mobile-menu__number" aria-hidden="true">
        {number}
      </span>
      <ScrambleText text={label} display={display} label={srLabel} />
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        end={to === "/"}
        className="mobile-menu__link"
        onClick={onClick}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a href="#contact" className="mobile-menu__link" onClick={onClick}>
      {content}
    </a>
  );
}

// Full-screen menu for phones. A modal dialog: focus moves in, Tab stays inside,
// Escape closes, and the page behind doesn't scroll.
function MobileMenu({ id, items, onClose, onContact }) {
  const panelRef = useRef(null);
  const { socialLinks } = useSiteSettings();

  useEffect(() => {
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.focus(); // announces "Site menu, dialog"; the first Tab goes to the first link

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep Tab inside the menu
      const focusable = panel.querySelectorAll("a[href], button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (document.activeElement === panel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Picking a link closes the menu without sending focus back to the menu button
  const closeForLink = () => onClose({ returnFocus: false });

  return (
    <div
      id={id}
      ref={panelRef}
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
    >
      {/* Big faded {f}, decoration only (same treatment as the CTA) */}
      <div className="mobile-menu__mark" aria-hidden="true">
        <img
          src={logoGhost}
          alt=""
          className="mobile-menu__mark-layer mobile-menu__mark-layer--sharp"
          width="609"
          height="443"
        />
        <img
          src={logoGhost}
          alt=""
          className="mobile-menu__mark-layer mobile-menu__mark-layer--blur"
          width="609"
          height="443"
        />
      </div>

      <div className="mobile-menu__top">
        <div className="mobile-menu__top-inner content-width">
          <button
            type="button"
            className="header__menu-button"
            aria-label="Close menu"
            onClick={() => onClose()}
          >
            <svg
              className="header__menu-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mobile-menu__body content-width">
        <nav aria-label="Primary">
          <ul className="mobile-menu__list">
            {items.map((item, index) => (
              <li key={item.to}>
                <MenuLink
                  {...item}
                  delay={START + index * STAGGER}
                  onClick={closeForLink}
                />
              </li>
            ))}
            <li>
              <MenuLink
                number="04"
                label="<Contact/>"
                srLabel="Contact"
                delay={START + items.length * STAGGER}
                onClick={onContact}
              />
            </li>
          </ul>
        </nav>

        {socialLinks.length > 0 && (
          <ul className="mobile-menu__social">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-menu__social-link"
                >
                  {PLATFORM_LABELS[link.platform] ?? link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
