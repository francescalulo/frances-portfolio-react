import { useParams } from "react-router-dom";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import "./WorkDetailPage.scss";

function WorkDetailPage() {
  const { slug } = useParams();

  return (
    <>
      <title>{`${slug} | Frances Calulo`}</title>
      <section className="work-detail content-width">
        <h1>Work Detail: {slug}</h1>
      </section>
      <ContactCTA variant="about" />
    </>
  );
}

export default WorkDetailPage;
