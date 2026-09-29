import "./Footer.scss";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner content-width">
        <p className="footer__copyright">
          © {year} Frances Calulo. All rights reserved.
        </p>
        {/* Social links from Site Settings (page 41) are added in a later step */}
      </div>
    </footer>
  );
}

export default Footer;
