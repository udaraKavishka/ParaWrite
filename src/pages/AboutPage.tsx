import About from "@/components/About";
import SeoMeta from "@/components/SeoMeta";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import PageFooterNav from "@/components/PageFooterNav";

const AboutPage = () => {
  return (
    <>
      <SeoMeta
        title="About ParaWrite | Manual Paraphrasing Platform"
        description="Learn about ParaWrite, a manual paraphrasing platform for high-control sentence-by-sentence editing and professional text refinement."
        path="/about"
      />
      <PageBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      <main className="container mx-auto px-4 py-8">
        <About />
        <PageFooterNav pageLabel="About" />
      </main>
    </>
  );
};

export default AboutPage;
