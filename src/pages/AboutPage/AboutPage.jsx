import useAboutPage from "../../hooks/useAboutPage";
import PageMeta from "../../components/PageMeta/PageMeta";
import AboutIntro from "../../components/AboutIntro/AboutIntro";
import CoreCompetencies from "../../components/CoreCompetencies/CoreCompetencies";
import AboutStatement from "../../components/AboutStatement/AboutStatement";
import FaqList from "../../components/FaqList/FaqList";
import Loader from "../../components/Loader/Loader";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import QuickInfo from "../../components/QuickInfo/QuickInfo";
import "./AboutPage.scss";

function AboutPage() {
  const { about, isLoaded, hasError } = useAboutPage();

  return (
    <>
      <PageMeta
        title="TheHuman | Frances Calulo"
        description={
          about?.yoast_head_json?.description ||
          "TheHuman behind the code: Frances Calulo’s story, core skills and the answers to the questions people ask most."
        }
      />

      <AboutIntro />

      <CoreCompetencies items={about?.acf?.core_competencies} />
      {/* Always on the page, so screen readers announce loading and errors */}
      <div className="about-page__status content-width" role="status">
        {!isLoaded && (
          <Loader code="fetching(about)…" label="Loading about page…" />
        )}
        {hasError && (
          <p className="about-page__error">
            My skills and FAQs didn’t render. Not my code, obviously. The server
            dropped the ball. Refresh, or check back in a bit.
          </p>
        )}
      </div>
      <AboutStatement />
      <FaqList faqs={about?.acf?.faqs} />

      <ContactCTA variant="about" aside={<QuickInfo />} />
    </>
  );
}

export default AboutPage;
