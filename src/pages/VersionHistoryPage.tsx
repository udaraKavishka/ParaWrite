import VersionHistory from "@/components/VersionHistory";
import SeoMeta from "@/components/SeoMeta";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import PageFooterNav from "@/components/PageFooterNav";

const VersionHistoryPage = () => {
  return (
    <>
      <SeoMeta
        title="ParaWrite Version History | Changelog and Roadmap"
        description="Track released versions, improvements, and upcoming roadmap items for ParaWrite."
        path="/version-history"
      />
      <PageBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Version History" }]} />
      <main className="container mx-auto px-4 py-8">
        <VersionHistory />
        <PageFooterNav pageLabel="Version History" />
      </main>
    </>
  );
};

export default VersionHistoryPage;
