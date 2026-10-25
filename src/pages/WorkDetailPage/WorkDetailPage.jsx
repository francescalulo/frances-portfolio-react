import { useParams } from "react-router-dom";
import useWorkDetail from "../../hooks/useWorkDetail";
import PageMeta from "../../components/PageMeta/PageMeta";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import WorkMeta from "../../components/WorkMeta/WorkMeta";
import WorkInfo from "../../components/WorkInfo/WorkInfo";
import WorkMockups from "../../components/WorkMockups/WorkMockups";
import KeyTakeaway from "../../components/KeyTakeaway/KeyTakeaway";
import SitePreview from "../../components/SitePreview/SitePreview";
import NextUp from "../../components/NextUp/NextUp";
import ContactCTA from "../../components/ContactCTA/ContactCTA";
import GlitchTitle from "../../components/GlitchTitle/GlitchTitle";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { decodeHtml } from "../../utilities/Utilities";
import "./WorkDetailPage.scss";

function WorkDetailPage() {
  const { slug } = useParams();
  const { project, isLoaded, hasError } = useWorkDetail(slug);

  // No project with this slug (e.g. a typo in the address): show the 404 page
  if (isLoaded && !hasError && !project) return <NotFoundPage />;

  if (!project) {
    return (
      <>
        <PageMeta title="The Build | Frances Calulo" />
        {/* Always on the page, so screen readers announce loading and errors */}
        <div
          className={
            isLoaded
              ? "work-detail__status content-width"
              : "work-detail__status work-detail__status--loading content-width"
          }
          role="status"
        >
          {!isLoaded && (
            <Loader code="fetching(project)…" label="Loading project…" />
          )}

          {hasError && (
            <p className="work-detail__error">
              This project didn’t render. Not my code, obviously. The server
              dropped the ball. Refresh, or check back in a bit.
            </p>
          )}
        </div>
      </>
    );
  }

  const title = decodeHtml(project.title.rendered);
  const projectType = project.acf?.project_type;
  const yoast = project.yoast_head_json;

  return (
    <>
      <PageMeta
        title={yoast?.title || title + " | Frances Calulo"}
        description={
          yoast?.description || decodeHtml(project.excerpt?.rendered).trim()
        }
      />

      <section className="work-detail__intro" aria-labelledby="work-title">
        <div className="work-detail__heading content-width">
          <Breadcrumb
            items={[{ label: "TheBuild", to: "/work" }, { label: title }]}
          />
          {projectType && (
            <p className="work-detail__eyebrow">
              <span aria-hidden="true">{"// "}</span>
              {projectType} case study
            </p>
          )}
          <GlitchTitle
            key={title}
            title={title}
            id="work-title"
            className="work-detail__title"
          />
        </div>

        <WorkMeta project={project} className="work-detail__meta" />
        <WorkInfo info={project.acf?.work_info} />
      </section>

      <WorkMockups mockups={project.acf?.mockups} title={title} />

      <KeyTakeaway
        text={project.acf?.key_takeaway}
        coded={project.acf?.key_takeaway_coded}
      />

      <SitePreview
        image={project.acf?.site_preview_image}
        embedUrl={project.acf?.site_preview_embed_url}
        embedWidth={project.acf?.site_preview_embed_width}
        liveUrl={project.acf?.live_site_url}
        repoUrl={project.acf?.repo_url}
        title={title}
      />

      <ContactCTA
        variant="about"
        aside={<NextUp next={project.next_project} />}
      />
    </>
  );
}

export default WorkDetailPage;
