import GlitchImage from "../GlitchImage/GlitchImage";
import "./ProjectImage.scss";

// Image sizes WordPress makes, smallest first (used to build srcSet)
const IMAGE_SIZES = ["medium", "medium_large", "large", "full"];

// A project's featured image (from ?_embed=wp:featuredmedia), or a placeholder until it
// has one. Shared by WorkCard (Home) and WorkRow (Work archive); the parent sets the
// box's size and shape through className.
// Decorative (alt=""): the project title next to it already names the project.
// glitch: the RGB-split glitch of the About photo (GlitchImage); the parent can also set it
// off with ref.current.glitch() (hovering a Home card or a Work archive row).
function ProjectImage({
  project,
  sizes,
  isEager = false,
  glitch = false,
  className = "",
  ref,
}) {
  const media = project._embedded?.["wp:featuredmedia"]?.[0];
  const mediaSizes = media?.media_details?.sizes ?? {};
  const srcSet = IMAGE_SIZES.map((name) => mediaSizes[name])
    .filter(Boolean)
    .map((size) => size.source_url + " " + size.width + "w")
    .join(", ");

  const imageProps = {
    srcSet: srcSet || undefined,
    sizes: srcSet ? sizes : undefined,
    loading: isEager ? "eager" : "lazy",
    decoding: "async",
  };

  const image = glitch ? (
    <GlitchImage
      ref={ref}
      className="project-image__img"
      src={media?.source_url}
      alt=""
      width={media?.media_details?.width}
      height={media?.media_details?.height}
      imageProps={imageProps}
    />
  ) : (
    <img
      {...imageProps}
      className="project-image__img"
      src={media?.source_url}
      width={media?.media_details?.width}
      height={media?.media_details?.height}
      alt=""
    />
  );

  return (
    <div className={"project-image " + className}>
      {media?.source_url ? (
        image
      ) : (
        <div className="project-image__placeholder" aria-hidden="true">
          <svg
            className="project-image__placeholder-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
          </svg>
          <span>Image coming soon</span>
        </div>
      )}
    </div>
  );
}

export default ProjectImage;
