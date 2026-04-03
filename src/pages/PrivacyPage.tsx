import SeoMeta from "@/components/SeoMeta";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import PageFooterNav from "@/components/PageFooterNav";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <>
      <SeoMeta
        title="Privacy Policy | ParaWrite"
        description="Read the ParaWrite privacy policy, including data handling, file processing behavior, and contact details."
        path="/privacy"
      />
      <PageBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy" }]} />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: 2026-04-03</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What ParaWrite processes</h2>
          <p className="text-muted-foreground">
            ParaWrite processes text and documents you provide for sentence-level editing and export.
            Files are processed in the browser where possible.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Storage behavior</h2>
          <p className="text-muted-foreground">
            ParaWrite may store session data in local browser storage to support recovery and continuity.
            You can clear this data in your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Security</h2>
          <p className="text-muted-foreground">
            We apply standard web security practices and recommend avoiding uploads that include sensitive,
            confidential, or regulated data unless your internal policy permits it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            For privacy questions, contact <a className="underline" href="mailto:hello@udaradev.me">hello@udaradev.me</a>.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <p>
            Related pages: <Link to="/terms" className="underline">Terms</Link>, <Link to="/about" className="underline">About</Link>, <Link to="/" className="underline">Tool</Link>.
          </p>
        </section>
        <PageFooterNav pageLabel="Privacy" />
      </main>
    </>
  );
};

export default PrivacyPage;
