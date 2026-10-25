import { useRef, useState } from "react";
import CodeToggle from "../CodeToggle/CodeToggle";
import DecodeText from "../DecodeText/DecodeText";
import DecodeSwitch from "../DecodeSwitch/DecodeSwitch";
import GlitchImage from "../GlitchImage/GlitchImage";
import PayrollLink from "../PayrollLink/PayrollLink";
import BrowserFrame from "../BrowserFrame/BrowserFrame";
import portrait from "../../assets/frances-portrait.webp";
import { mediaSrcSet, toCodeLines } from "../../utilities/Utilities";
import "./AboutIntro.scss";

const NBSP = "\u00A0";

const PORTRAIT_ALT = "Portrait of Frances Calulo"; // when the Media Library alt is empty
// The card is 17.5rem wide on phones, 13rem on tablets, 18.5rem on desktop
const PORTRAIT_SIZES =
  "(min-width: 64em) 18.5rem, (min-width: 48em) 13rem, 17.5rem";

// The bio as code: two spaces = one indent step, "" = an empty line between groups
const BIO_CODE = [
  "  // skills that update over time",
  '  const [skills, setSkills] = useState(["Figma", "React", "JavaScript", "HTML", "CSS", "WordPress", "Git"]);',
  "",
  "  // learns something new whenever curiosity fires",
  "  useEffect(() => {",
  '    console.log("always learning something new");',
  "  }, [skills]);",
  "",
  "  // expensive to recalculate, so it's memoized: good taste",
  "  const goodTaste = useMemo(() => designs.filter(d => d.looksGood && d.worksGood), [designs]);",
  "",
  "  // stable across renders, the thing that never breaks under pressure",
  '  const stayCalmUnderDeadline = useCallback(() => "still shipping", []);',
  "",
  "  // low priority, runs in the background while something more urgent plays out",
  "  const [, startNightMode] = useTransition();",
  "  startNightMode(() => {",
  '    console.log("urgent: the K-drama/true-crime marathon. background: an Everest-sized pile of laundry.");',
  "  });",
  "",
  "  // reaches into the bigger picture",
  '  // the "why," not just the "how"',
  "  const userNeeds = useContext(ProductContext);",
  "",
  "  // holds onto something that shouldn't trigger a re-render",
  "  // like a coffee-and-cake count that only ever climbs, especially past midnight",
  "  const fuelCount = useRef({ coffee: 0, cake: 0 });",
  "",
  "  return `Hi, I'm Frances — ${role}, powered by ${skills.length} skills and zero unnecessary re-renders.`;",
];

const BIO = [
  "I’m a designer and developer, and no re-renders required.",
  "That means I’m fluent in Figma, React, JavaScript, HTML, CSS, WordPress, and Git, the actual tools it takes to design something and then ship it myself.",
  "I’m always chasing the next thing to learn, right now that’s TypeScript and accessibility.",
  "Good taste doesn’t come cheap either, mine is memoized, because recalculating it from scratch every time would be exhausting.",
  "Under pressure, I don’t budge: still shipping, no matter the deadline.",
  "Off the clock, the priorities flip: the K-drama and true crime take over, and the Everest-sized pile of laundry gets deferred to whenever there’s room.",
  "Through all of it, I keep the bigger picture in view, the why behind the how.",
  "And the whole thing runs on a coffee-and-cake count that only ever climbs, especially past midnight.",
];

const CODED = toCodeLines([...BIO_CODE, "}"], "about-intro").map((line) =>
  line.segments.some((segment) => segment.text === "return")
    ? { ...line, className: line.className + " about-intro__code--highlight" }
    : line,
);

// Readable bio: key phrases in the syntax colours (each phrase → its colour)
const BIO_HIGHLIGHTS = {
  designer: "pink",
  developer: "green",
  "Figma, React, JavaScript, HTML, CSS, WordPress, and Git": "green",
  "TypeScript and accessibility": "yellow",
  memoized: "blue",
  "still shipping": "green",
  "K-drama and true crime": "pink",
  "Everest-sized pile of laundry": "yellow",
  "the why behind the how": "pink",
  "coffee-and-cake": "yellow",
};
const HIGHLIGHT_PATTERN = new RegExp(
  "(" + Object.keys(BIO_HIGHLIGHTS).join("|") + ")",
);

const DECODED = BIO.map((text) => ({
  className: "about-intro__prose",
  segments: text
    .split(HIGHLIGHT_PATTERN)
    .filter(Boolean)
    .map((part) =>
      BIO_HIGHLIGHTS[part]
        ? {
            text: part,
            className:
              "about-intro__mark about-intro__mark--" + BIO_HIGHLIGHTS[part],
          }
        : { text: part },
    ),
}));

// Beside the photo: small framing lines + large meaning lines (like the About snippet)
const HELLO_CODED = [
  {
    className: "about-intro__small",
    segments: [{ text: "function", className: "about-intro__keyword" }],
  },
  {
    className: "about-intro__big about-intro__name",
    segments: [
      { text: "Frances" + NBSP + "Calulo" },
      {
        text: " (" + NBSP + ")" + NBSP + "{",
        className: "about-intro__signature",
      },
    ],
  },
  {
    className: "about-intro__small about-intro__step",
    segments: [
      {
        text: "// core identity, doesn't change on re-render",
        className: "about-intro__comment",
      },
    ],
  },
  {
    className: "about-intro__small about-intro__step",
    segments: [
      { text: "const", className: "about-intro__keyword" },
      { text: " [role] = " },
      { text: "useState(", className: "about-intro__key" },
    ],
  },
  {
    className: "about-intro__big about-intro__step-2",
    segments: [
      { text: '"', className: "about-intro__key" },
      {
        text: "designer" + NBSP + "&" + NBSP + "developer",
        className: "about-intro__value",
      },
      { text: '"', className: "about-intro__key" },
    ],
  },
  {
    className: "about-intro__small about-intro__step",
    segments: [{ text: ");", className: "about-intro__key" }],
  },
];

// Decoded: four lines, all one size, like a sentence said out loud
const HELLO_DECODED = [
  { className: "about-intro__said", segments: [{ text: "Hi I’m" }] },
  { className: "about-intro__said", segments: [{ text: "Frances Calulo" }] },
  {
    className: "about-intro__said",
    segments: [
      { text: "Designer", className: "about-intro__designer" },
      { text: " & " },
      { text: "Developer", className: "about-intro__developer" },
    ],
  },
  { className: "about-intro__said", segments: [{ text: "ready to deploy" }] },
];

// About intro + bio: the portrait card with the name lines beside it, and the rest of the
// bio in an editor window in its own section below. The intro types like the Home hero
// (and the photo glitches each time it switches); the bio has its own switch.
// photo: the About page's featured image in WordPress. While the page loads the card keeps
// its shape; if WordPress has no image (or can't be reached) the built-in portrait shows.
function AboutIntro({ photo, isLoaded }) {
  const [isBioDecoded, setIsBioDecoded] = useState(false);
  const photoRef = useRef(null);

  const srcSet = mediaSrcSet(photo);
  let image = null;
  if (photo?.source_url) {
    image = {
      src: photo.source_url,
      alt: photo.alt_text || PORTRAIT_ALT,
      width: photo.media_details?.width,
      height: photo.media_details?.height,
    };
  } else if (isLoaded) {
    image = { src: portrait, alt: PORTRAIT_ALT, width: 720, height: 1016 };
  }

  return (
    <>
      <section className="about-intro" aria-labelledby="about-heading">
        <div className="about-intro__inner content-width">
          <div className="about-intro__card">
            {image ? (
              <GlitchImage
                ref={photoRef}
                {...image}
                className="about-intro__photo"
                imageProps={{
                  srcSet: srcSet || undefined,
                  sizes: srcSet ? PORTRAIT_SIZES : undefined,
                  decoding: "async",
                }}
              />
            ) : (
              <div className="about-intro__photo" aria-hidden="true" />
            )}
            <div className="about-intro__card-bar" aria-hidden="true">
              frances_calulo.jsx
              <span className="about-intro__card-dot" />
            </div>
          </div>

          <div className="about-intro__hello">
            {/* Screen readers get the plain heading; the code switch is visual only */}
            <h1 id="about-heading" className="visually-hidden">
              Hi, I’m Frances Calulo, designer and developer
            </h1>
            <DecodeText
              className="about-intro__decode"
              coded={HELLO_CODED}
              decoded={HELLO_DECODED}
              toggle
              onSwitch={() => photoRef.current?.glitch()}
            />
            <PayrollLink className="about-intro__button" />
          </div>
        </div>
      </section>

      {/* The rest of the bio in its own section, without rails (like the Work mockups) */}
      <section
        className="about-bio"
        aria-labelledby="about-bio-heading"
        data-rails="false"
      >
        <h2 id="about-bio-heading" className="visually-hidden">
          About me
        </h2>
        <div className="about-bio__inner content-width">
          <div className="visually-hidden">
            {BIO.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          <BrowserFrame address="bio.jsx" className="about-bio__window">
            <DecodeSwitch
              className="about-bio__switch"
              isDecoded={isBioDecoded}
              onClick={() => setIsBioDecoded(!isBioDecoded)}
              label="bio"
            />
            <CodeToggle
              className="about-bio__text"
              numberRows
              coded={CODED}
              decoded={DECODED}
              isDecoded={isBioDecoded}
            />
          </BrowserFrame>
        </div>
      </section>
    </>
  );
}

export default AboutIntro;
