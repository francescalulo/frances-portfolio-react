import "./BrowserFrame.scss";

// A browser window around a preview: three dots and (optionally) an address on top.
// With href, the address is a link (opens in a new tab); linkLabel tells screen
// readers where it goes, e.g. "Live site:".
function BrowserFrame({
  address,
  href,
  linkLabel = "",
  children,
  className = "",
}) {
  return (
    <div className={"browser-frame " + className}>
      <div className="browser-frame__bar">
        <span className="browser-frame__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        {address &&
          (href ? (
            <a
              href={href}
              className="browser-frame__address browser-frame__address--link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkLabel && (
                <span className="visually-hidden">{linkLabel + " "}</span>
              )}
              {address} <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="browser-frame__address">{address}</span>
          ))}
      </div>

      <div className="browser-frame__screen">{children}</div>
    </div>
  );
}

export default BrowserFrame;
