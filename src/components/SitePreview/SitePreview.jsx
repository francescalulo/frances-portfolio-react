import BrowserFrame from "../BrowserFrame/BrowserFrame";
import ACFImage from "../../utilities/ACFImage";
import { safeUrl } from "../../utilities/Utilities";
import "./SitePreview.scss";

// Project live URL
// Project Repository
function shortAddress(url) {
  const { host, pathname } = new URL(url);
  return host + pathname.replace(/(\.git)?\/?$/, "");
}

// Work Detail "Site Preview": the ACF screenshot next to a scrollable live embed of the
// site. The screenshot's address bar links to the repo, the embed's to the live site.
// The embed only loads https pages, sandboxed.
function SitePreview({ image, embedUrl, liveUrl, repoUrl, title }) {
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
              src={embed}
              title={"Live preview of " + title + " (scrollable)"}
              className="site-preview__embed"
              sandbox="allow-scripts allow-same-origin" // my own sites: scripts run, nothing else
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
