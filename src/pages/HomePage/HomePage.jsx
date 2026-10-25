import Hero from "../../components/Hero/Hero";
import FeaturedWork from "../../components/FeaturedWork/FeaturedWork";
import AboutSnippet from "../../components/AboutSnippet/AboutSnippet";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import PageMeta from "../../components/PageMeta/PageMeta";

function HomePage() {
  return (
    <>
      <PageMeta
        title="Frances Calulo | Designer & Developer"
        description="Designer and developer Frances Calulo builds accessible, mobile-first websites with React and headless WordPress, turning coffee into pixels and pixels into code."
      />
      <Hero />
      <FeaturedWork />
      <AboutSnippet />
      <ContactCTA fullScreen />
    </>
  );
}

export default HomePage;
