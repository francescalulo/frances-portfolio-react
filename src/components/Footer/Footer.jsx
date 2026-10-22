import useSiteSettings from "../../hooks/useSiteSettings";
import { PLATFORM_LABELS } from "../../utilities/Utilities";
import "./Footer.scss";

function Footer() {
  const { socialLinks } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner content-width">
        <p className="footer__copyright">
          © {year} Frances Calulo. All rights reserved.
        </p>

        {socialLinks.length > 0 && (
          <ul className="footer__social">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                >
                  {PLATFORM_LABELS[link.platform] ?? link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}

export default Footer;
