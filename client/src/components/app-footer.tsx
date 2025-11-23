import { FileQuestion, HelpCircle, Shield } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3">
            <FileQuestion className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Sample Files</h3>
              <p className="text-sm text-muted-foreground">
                Download example JSON files to test conversions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to handle nested objects and arrays
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground">
                Your data is processed securely and never stored
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JSON Converter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
