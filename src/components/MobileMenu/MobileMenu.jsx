import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import GhostLogo from "../GhostLogo/GhostLogo";
import useScramble from "../../hooks/useScramble";
import useSiteSettings from "../../hooks/useSiteSettings";
import ScrambleText from "../ScrambleText/ScrambleText";
import SocialLink from "../SocialLink/SocialLink";
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
// Closing plays the opening in reverse (links leave, the circle shrinks into the menu
// button), then onClose runs. Reduced motion: closes instantly.
function MobileMenu({ id, items, onClose, onContact }) {
  const panelRef = useRef(null);
  const { socialLinks } = useSiteSettings();
  const [closing, setClosing] = useState(null); // while closing: what to do once it's gone

  // options go to onClose; afterClose runs once the menu is gone (Contact's jump)
  const requestClose = useCallback(
    (options, afterClose) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onClose(options);
        afterClose?.();
        return;
      }
      setClosing({ options, afterClose });
    },
    [onClose],
  );

  // The panel's closing animation has finished (the links' animations bubble up too)
  function handleAnimationEnd(event) {
    if (!closing || event.animationName !== "mobile-menu-out") return;
    onClose(closing.options);
    closing.afterClose?.();
  }

  useEffect(() => {
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.focus(); // announces "Site menu, dialog"; the first Tab goes to the first link

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        requestClose();
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
  }, [requestClose]);

  // Picking a link closes the menu without sending focus back to the menu button
  const closeForLink = () => requestClose({ returnFocus: false });

  // Contact: close first, then jump to the CTA
  function closeForContact(event) {
    event.preventDefault();
    requestClose({ returnFocus: false }, () => onContact(event));
  }
  return (
    <div
      id={id}
      ref={panelRef}
      className={"mobile-menu" + (closing ? " is-closing" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      onAnimationEnd={handleAnimationEnd}
    >
      <GhostLogo layerClassName="mobile-menu__mark-layer" />

      <div className="mobile-menu__top">
        <div className="mobile-menu__top-inner content-width">
          <button
            type="button"
            className="header__menu-button"
            aria-label="Close menu"
            onClick={() => requestClose()}
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
                onClick={closeForContact}
              />
            </li>
          </ul>
        </nav>

        {socialLinks.length > 0 && (
          <ul className="mobile-menu__social">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <SocialLink link={link} className="mobile-menu__social-link" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
