import useSiteSettings from "../../hooks/useSiteSettings";
import SocialLink from "../SocialLink/SocialLink";
import "./Footer.scss";

function Footer() {
  const { socialLinks } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner content-width">
        {/* Each sentence wraps as a whole, never mid-sentence */}
        <p className="footer__copyright">
          <span className="footer__phrase">© {year} Frances Calulo.</span>{" "}
          <span className="footer__phrase">All rights reserved.</span>
        </p>

        {socialLinks.length > 0 && (
          <ul className="footer__social">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <SocialLink link={link} className="footer__social-link" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}

export default Footer;
