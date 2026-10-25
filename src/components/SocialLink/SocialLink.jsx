import { PLATFORM_LABELS } from "../../utilities/Utilities";

// One social profile link from Site Settings (Footer, Quick Info, mobile menu). Opens in
// a new tab, so screen readers are told before they follow it.
function SocialLink({ link, className }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {PLATFORM_LABELS[link.platform] ?? link.platform}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

export default SocialLink;
