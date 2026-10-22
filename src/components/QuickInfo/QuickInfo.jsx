import useSiteSettings from "../../hooks/useSiteSettings";
import { PLATFORM_LABELS } from "../../utilities/Utilities";
import "./QuickInfo.scss";

// Left column of the About page CTA. All values come from Site Settings in WordPress.
function QuickInfo() {
  const { settings, socialLinks } = useSiteSettings();

  return (
    <div className="quick-info">
      <h2 className="quick-info__title">Quick Info</h2>

      <dl className="quick-info__list">
        {settings?.location && (
          <div className="quick-info__item">
            <dt className="quick-info__label">Location</dt>
            <dd className="quick-info__value">{settings.location}</dd>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="quick-info__item">
            <dt className="quick-info__label">Networks</dt>
            <dd className="quick-info__value">
              {socialLinks.map((link, index) => (
                <span key={link.platform}>
                  {index > 0 && " / "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-info__link"
                  >
                    {PLATFORM_LABELS[link.platform] ?? link.platform}
                  </a>
                </span>
              ))}
            </dd>
          </div>
        )}

        {settings?.contact_email && (
          <div className="quick-info__item quick-info__item--full">
            <dt className="quick-info__label">Email</dt>
            <dd className="quick-info__value">
              <a
                href={"mailto:" + settings.contact_email}
                className="quick-info__link"
              >
                {settings.contact_email}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export default QuickInfo;
