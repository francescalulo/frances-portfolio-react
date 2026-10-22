import useSiteSettings from "../../hooks/useSiteSettings";
import { scrollToSection } from "../../utilities/Utilities";

// "Payroll Please": opens an email to Frances (the address comes from Site Settings).
// Until the address has loaded it jumps to the Contact section instead, so the button is
// never missing. Screen readers also hear the address.
function PayrollLink({ className, children = "Payroll Please" }) {
  const { settings } = useSiteSettings();
  const email = settings?.contact_email;

  // The anchor works without JS; with JS we scroll smoothly and move focus
  function jumpToContact(event) {
    if (scrollToSection("contact")) event.preventDefault();
  }

  if (!email) {
    return (
      <a href="#contact" className={className} onClick={jumpToContact}>
        {children}
      </a>
    );
  }

  return (
    <a href={"mailto:" + email} className={className}>
      {children}
      <span className="visually-hidden"> (email {email})</span>
    </a>
  );
}

export default PayrollLink;
