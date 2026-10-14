import Hero from "../../components/Hero/Hero";
import FeaturedWork from "../../components/FeaturedWork/FeaturedWork";
import AboutSnippet from "../../components/AboutSnippet/AboutSnippet";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import "./HomePage.scss";

function HomePage() {
  return (
    <>
      <title>Frances Calulo | Designer & Developer</title>
      <Hero />
      <FeaturedWork />
      <AboutSnippet />
      <ContactCTA />
    </>
  );
}

export default HomePage;
