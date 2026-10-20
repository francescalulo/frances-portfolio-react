import ContactCTA from "../../components/ContactCTA/ContactCTA";
import QuickInfo from "../../components/QuickInfo/QuickInfo";
import PageMeta from "../../components/PageMeta/PageMeta";
import "./AboutPage.scss";

function AboutPage() {
  return (
    <>
      <PageMeta
        title="TheHuman | Frances Calulo"
        description="TheHuman behind the code: Frances Calulo’s story, core skills and the answers to the questions people ask most."
      />
      <section className="about content-width">
        <h1>TheHuman (About)</h1>
      </section>
      <ContactCTA variant="about" aside={<QuickInfo />} />
    </>
  );
}

export default AboutPage;
