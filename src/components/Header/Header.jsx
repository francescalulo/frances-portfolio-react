import { Link, NavLink } from "react-router-dom";
import { scrollToSection } from "../../utilities/Utilities";
import logo from "../../assets/frances-logo.svg";
import "./Header.scss";

const navItems = [
  { number: "01", label: "<TheLounge/>", to: "/" },
  { number: "02", label: "<TheBuild/>", to: "/work" },
  { number: "03", label: "<TheHuman/>", to: "/about" },
];

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
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className="header__link"
                >
                  <span className="header__number">{item.number}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="header__item">
              <a
                href="#contact"
                onClick={scrollToContact}
                className="header__link"
              >
                <span className="header__number">04</span>
                {"<Contact/>"}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
