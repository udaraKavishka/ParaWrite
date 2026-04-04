import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageFooterNavProps {
  pageLabel: string;
}

const PageFooterNav = ({ pageLabel }: PageFooterNavProps) => {
  return (
    <footer className="border-t border-border mt-10 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link to="/">Back to Tool</Link>
        </Button>

        <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-medium">You are here: {pageLabel}</span>
          <span>•</span>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <span>•</span>
          <Link to="/use-cases" className="hover:text-foreground transition-colors">Use Cases</Link>
          <span>•</span>
          <Link to="/version-history" className="hover:text-foreground transition-colors">Changelog</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default PageFooterNav;
