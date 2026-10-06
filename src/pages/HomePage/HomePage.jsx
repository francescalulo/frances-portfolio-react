import Hero from "../../components/Hero/Hero";
import AboutSnippet from "../../components/AboutSnippet/AboutSnippet";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import "./HomePage.scss";

function HomePage() {
  return (
    <>
      <title>Frances Calulo | Designer & Developer</title>
      <Hero />
      <AboutSnippet />
      <ContactCTA />
    </>
  );
}

export default HomePage;
