import ContactCTA from "../../components/ContactCTA/ContactCTA";
import QuickInfo from "../../components/QuickInfo/QuickInfo";
import "./AboutPage.scss";

function AboutPage() {
  return (
    <>
      <title>TheHuman | Frances Calulo</title>
      <section className="about content-width">
        <h1>TheHuman (About)</h1>
      </section>
      <ContactCTA variant="about" aside={<QuickInfo />} />
    </>
  );
}

export default AboutPage;
