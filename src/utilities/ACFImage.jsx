// Image sizes WordPress makes, smallest first (used to build srcSet)
const IMAGE_SIZES = [
  "medium",
  "medium_large",
  "large",
  "1536x1536",
  "2048x2048",
];

// An image from an ACF image field (Return Format: Image Array), with srcSet so the
// browser downloads the smallest file that looks sharp.
// alt: the Media Library alt text, or fallbackAlt when that's empty.
function ACFImage({
  image,
  sizes = "100vw",
  fallbackAlt = "",
  isEager = false,
  className = "",
}) {
  if (!image?.url) return null;

  // One file per width (WordPress lists sizes bigger than the original at the original size)
  const byWidth = new Map();
  IMAGE_SIZES.forEach((name) => {
    const width = image.sizes?.[name + "-width"];
    if (image.sizes?.[name] && width) byWidth.set(width, image.sizes[name]);
  });
  byWidth.set(image.width, image.url);

  const srcSet = [...byWidth]
    .map(([width, url]) => url + " " + width + "w")
    .join(", ");

  return (
    <img
      className={className}
      src={image.url}
      srcSet={srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt || fallbackAlt}
      loading={isEager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export default ACFImage;
