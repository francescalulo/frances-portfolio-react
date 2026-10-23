import useSiteSettings from "../../hooks/useSiteSettings";
import SocialLink from "../SocialLink/SocialLink";
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
