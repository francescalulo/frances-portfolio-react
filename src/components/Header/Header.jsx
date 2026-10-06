import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/frances-logo.svg";
import useScramble from "../../hooks/useScramble";
import ScrambleText from "../ScrambleText/ScrambleText";
import { scrollToSection } from "../../utilities/Utilities";
import "./Header.scss";

const navItems = [
  { number: "01", label: "<TheLounge/>", srLabel: "TheLounge (Home)", to: "/" },
  {
    number: "02",
    label: "<TheBuild/>",
    srLabel: "TheBuild (Work)",
    to: "/work",
  },
  {
    number: "03",
    label: "<TheHuman/>",
    srLabel: "TheHuman (About)",
    to: "/about",
  },
];

// One nav link with the scramble effect on hover and keyboard focus.
// With `to` it's a route (NavLink); without it, it's the in-page Contact jump.
function NavItem({ number, label, srLabel, to, onClick }) {
  const { display, scramble } = useScramble(label);

  const content = (
    <>
      <span className="header__number" aria-hidden="true">
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
        className="header__link"
        onMouseEnter={scramble}
        onFocus={scramble}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a
      href="#contact"
      className="header__link"
      onClick={onClick}
      onMouseEnter={scramble}
      onFocus={scramble}
    >
      {content}
    </a>
  );
}

function Header() {
  // Contact isn't a route: it jumps to the ContactCTA (id="contact") on the current page.
  function scrollToContact(event) {
    event.preventDefault();
    scrollToSection("contact");
  }

  return (
    <header className="header">
      <div className="header__inner content-width">
        <Link to="/" className="header__logo" aria-label="Frances Calulo, home">
          <img
            src={logo}
            alt=""
            className="header__logo-mark"
            width="44"
            height="44"
          />
          <span className="header__logo-text">Frances Calulo</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__list">
            {navItems.map((item) => (
              <li key={item.to} className="header__item">
                <NavItem {...item} />
              </li>
            ))}
            <li className="header__item">
              <NavItem
                number="04"
                label="<Contact/>"
                srLabel="Contact"
                onClick={scrollToContact}
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
