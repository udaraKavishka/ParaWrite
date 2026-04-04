import SeoMeta from "@/components/SeoMeta";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import PageFooterNav from "@/components/PageFooterNav";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <>
      <SeoMeta
        title="Terms of Use | ParaWrite"
        description="Read the ParaWrite terms of use, acceptable usage expectations, and legal disclaimers."
        path="/terms"
      />
      <PageBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms" }]} />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl space-y-5 sm:space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Terms of Use</h1>
          <p className="text-muted-foreground">Last updated: 2026-04-03</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Acceptable use</h2>
          <p className="text-muted-foreground">
            You are responsible for how you use ParaWrite and for ensuring your usage complies with
            applicable laws, policies, and content rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Service scope</h2>
          <p className="text-muted-foreground">
            ParaWrite provides text processing and sentence-level editing workflows. It is provided on an
            as-is basis without guarantees of uninterrupted availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">User responsibility</h2>
          <p className="text-muted-foreground">
            You are responsible for reviewing and validating output before publication or submission.
            Do not upload content that violates contractual, legal, or regulatory obligations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            For legal and policy questions, contact <a className="underline" href="mailto:hello@udaradev.me">hello@udaradev.me</a>.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <p>
            Related pages: <Link to="/privacy" className="underline">Privacy</Link>, <Link to="/about" className="underline">About</Link>, <Link to="/" className="underline">Tool</Link>.
          </p>
        </section>
        <PageFooterNav pageLabel="Terms" />
      </main>
    </>
  );
};

export default TermsPage;
