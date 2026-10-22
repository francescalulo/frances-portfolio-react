import DecodeText from "../DecodeText/DecodeText";
import { toCodeLines } from "../../utilities/Utilities";
import "./AboutStatement.scss";

const NBSP = "\u00A0";
// Each line of the statement on its own line. On small phones a line only wraps after a
// comma: the words of each phrase are joined with NBSP (a space that never wraps).
const STATEMENT_LINES = [
  "Mom, designer, developer,",
  "on" + NBSP + "repeat, same" + NBSP + "skill" + NBSP + "set,",
  "no" + NBSP + "sleep" + NBSP + "required.",
];
const STATEMENT = STATEMENT_LINES.join(" ");

// One large "this.<role> = true;" line, two indent steps in
const roleLine = (role) => ({
  className:
    "about-statement__code about-statement__code-big about-statement__indent-2",
  segments: [
    { text: "this", className: "about-statement__keyword" },
    { text: "." },
    { text: role, className: "about-statement__role" },
    { text: " = " },
    { text: "true", className: "about-statement__keyword" },
    { text: ";" },
  ],
});

const CODED = [
  ...toCodeLines(
    [
      "keepGoing(" + NBSP + ") {",
      "  const skillSet = ['patience', 'problem-solving', 'staying calm under chaos'];",
      "  while (this.sleep === null) {",
    ],
    "about-statement",
  ),
  roleLine("momOf3"),
  roleLine("designs"),
  roleLine("codes"),
  ...toCodeLines(
    ["", "    // running on the same skillSet, every single time", "  }", "}"],
    "about-statement",
  ),
];

const DECODED = [
  {
    className: "about-statement__eyebrow",
    segments: [{ text: "console.log(" + NBSP + ")" }],
  },
  ...STATEMENT_LINES.map((text) => ({
    className: "about-statement__text",
    segments: [{ text }],
  })),
];

// About "Essence of me": the big statement, decoded by default; hovering / tapping types
// the code version (like the Home About snippet)
function AboutStatement() {
  return (
    <section
      className="about-statement"
      aria-labelledby="about-statement-heading"
    >
      <div className="about-statement__inner content-width">
        {/* Screen readers get the plain statement; DecodeText is visual only */}
        <h2 id="about-statement-heading" className="visually-hidden">
          {STATEMENT}
        </h2>
        <DecodeText
          className="about-statement__decode"
          coded={CODED}
          decoded={DECODED}
          startDecoded
          colorShuffle
        />
      </div>
    </section>
  );
}

export default AboutStatement;
