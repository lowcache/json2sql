import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Code2, Check } from "lucide-react";

interface AppHeaderProps {
  isPremium?: boolean;
  onUpgrade: () => void;
}

export function AppHeader({ isPremium, onUpgrade }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">JSON Converter</h1>
              <p className="text-sm text-muted-foreground">SQL & CSV Export Tool</p>
            </div>
          </div>

          {isPremium ? (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Premium</span>
            </Badge>
          ) : (
            <Button
              variant="default"
              onClick={onUpgrade}
              data-testid="button-upgrade-header"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
