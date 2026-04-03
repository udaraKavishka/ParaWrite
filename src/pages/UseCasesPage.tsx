import UseCases from "@/components/UseCases";
import SeoMeta from "@/components/SeoMeta";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import PageFooterNav from "@/components/PageFooterNav";

const UseCasesPage = () => {
  return (
    <>
      <SeoMeta
        title="ParaWrite Use Cases | Manual Rewriting Workflows"
        description="Explore real-world use cases for manual paraphrasing, sentence editing, and quality-focused rewriting workflows with ParaWrite."
        path="/use-cases"
      />
      <PageBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Use Cases" }]} />
      <main className="container mx-auto px-4 py-8">
        <UseCases />
        <PageFooterNav pageLabel="Use Cases" />
      </main>
    </>
  );
};

export default UseCasesPage;
