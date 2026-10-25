import BrowserFrame from "../BrowserFrame/BrowserFrame";
import ACFImage from "../../utilities/ACFImage";
import "./WorkMockups.scss";

// ACF breakpoint choice → words for the alt text
const BREAKPOINTS = {
  all: "desktop, tablet and phone",
  desktop: "desktop",
  tablet: "tablet",
  mobile: "phone",
};

// Work Detail "Mockups Across Breakpoints" (ACF mockups repeater). Each image sits in a
// 16:9 browser card (cropped to fill); on desktop the section is one screen tall.
// Several mockups sit side by side. Rows without an image are skipped.
function WorkMockups({ mockups, title }) {
  const rows = (mockups || []).filter((row) => row.image?.url);
  if (rows.length === 0) return null;

  return (
    <section
      className="work-mockups"
      aria-labelledby="work-mockups-heading"
      data-rails="false"
    >
      <h2 id="work-mockups-heading" className="visually-hidden">
        Mockups across breakpoints
      </h2>

      <div
        className={
          "work-mockups__inner content-width" +
          (rows.length > 1 ? " work-mockups__inner--grid" : "")
        }
      >
        {rows.map((row, index) => (
          <BrowserFrame
            key={row.breakpoint + "-" + index}
            className="work-mockups__frame"
          >
            <ACFImage
              image={row.image}
              className="work-mockups__image"
              sizes={
                rows.length > 1
                  ? "(min-width: 48em) 45vw, 100vw"
                  : "(min-width: 90em) 80rem, 100vw"
              }
              fallbackAlt={
                title + " on " + (BREAKPOINTS[row.breakpoint] ?? row.breakpoint)
              }
            />
          </BrowserFrame>
        ))}
      </div>
    </section>
  );
}

export default WorkMockups;
