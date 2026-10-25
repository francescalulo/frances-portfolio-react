import { Routes, Route } from "react-router-dom";

import ScrollCue from "../components/ScrollCue/ScrollCue";
import ScrollToTop from "../utilities/ScrollToTop";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import HomePage from "../pages/HomePage/HomePage";
import WorkPage from "../pages/WorkPage/WorkPage";
import WorkDetailPage from "../pages/WorkDetailPage/WorkDetailPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

function AppRouter() {
  return (
    <div className="wrapper">
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollCue />
    </div>
  );
}

export default AppRouter;
