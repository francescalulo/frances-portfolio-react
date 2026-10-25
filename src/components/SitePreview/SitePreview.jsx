import { useEffect, useRef, useState } from "react";
import BrowserFrame from "../BrowserFrame/BrowserFrame";
import ACFImage from "../../utilities/ACFImage";
import { safeUrl } from "../../utilities/Utilities";
import "./SitePreview.scss";

// A URL without "https://" and a trailing "/" or ".git", for the address bar
// (https://github.com/francescalulo/polar-db.git → github.com/francescalulo/polar-db)
function shortAddress(url) {
  const { host, pathname } = new URL(url);
  return host + pathname.replace(/(\.git)?\/?$/, "");
}

// Work Detail "Site Preview": the ACF screenshot next to a scrollable live embed of the
// site. The screenshot's address bar links to the repo, the embed's to the live site.
// The embed only loads https pages (my own sites, so no sandbox: they need their scripts
// and storage, and sandbox with both allowed would add no protection).
// embedWidth (ACF, optional): for a site not built for small screens (e.g. a game), the
// width it needs. It's drawn at that width and scaled down to fit the frame.
function SitePreview({ image, embedUrl, embedWidth, liveUrl, repoUrl, title }) {
  const embedRef = useRef(null);
  const [scale, setScale] = useState(1);
  const siteWidth = Number(embedWidth) || 0;

  // Scaled embed: fits the site's width into the frame, and refits when the frame resizes
  useEffect(() => {
    const screen = embedRef.current?.parentElement;
    if (!siteWidth || !screen) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / siteWidth));
    });
    observer.observe(screen);
    return () => observer.disconnect();
  }, [siteWidth]);
  const live = safeUrl(liveUrl);
  const repo = safeUrl(repoUrl);
  const embed = safeUrl(embedUrl);
  const canEmbed = Boolean(embed?.startsWith("https://"));
  const hasImage = Boolean(image?.url);

  if (!hasImage && !canEmbed) return null;

  const address = live ? shortAddress(live) : null;

  // Screenshot frame: the repo if there is one; the live site if there's no embed for it
  const imageLink = repo || (canEmbed ? null : live);

  return (
    <section
      className="site-preview"
      aria-labelledby="site-preview-heading"
      data-rails="false"
    >
      <h2 id="site-preview-heading" className="visually-hidden">
        Site preview
      </h2>

      <div className="site-preview__inner content-width">
        {hasImage && (
          <BrowserFrame
            className="site-preview__frame"
            address={imageLink ? shortAddress(imageLink) : address}
            href={imageLink}
            linkLabel={imageLink === repo ? "Source code:" : "Live site:"}
          >
            <ACFImage
              image={image}
              className="site-preview__image"
              sizes="(min-width: 48em) 45vw, 100vw"
              fallbackAlt={"Screenshot of " + title}
            />
          </BrowserFrame>
        )}

        {canEmbed && (
          <BrowserFrame
            className="site-preview__frame"
            address={address}
            href={live}
            linkLabel="Live site:"
          >
            <iframe
              ref={embedRef}
              src={embed}
              title={"Live preview of " + title + " (scrollable)"}
              className={
                siteWidth
                  ? "site-preview__embed site-preview__embed--scaled"
                  : "site-preview__embed"
              }
              style={
                siteWidth
                  ? {
                      "--embed-width": siteWidth + "px",
                      "--embed-scale": scale,
                    }
                  : undefined
              }
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </BrowserFrame>
        )}
      </div>
    </section>
  );
}

export default SitePreview;
