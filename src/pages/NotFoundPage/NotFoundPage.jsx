import { Link } from "react-router-dom";
import "./NotFoundPage.scss";

function NotFoundPage() {
  return (
    <>
      <title>Page Not Found | Frances Calulo</title>
      <section className="not-found content-width">
        <h1>404: This page didn't render.</h1>
        <Link to="/">Back to TheLounge →</Link>
      </section>
    </>
  );
}

export default NotFoundPage;
