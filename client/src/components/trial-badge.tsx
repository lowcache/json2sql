import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles } from "lucide-react";

interface TrialBadgeProps {
  recordCount: number;
  onUpgrade: () => void;
  isPremium?: boolean;
}

const TRIAL_LIMIT = 50;

export function TrialBadge({ recordCount, onUpgrade, isPremium }: TrialBadgeProps) {
  if (isPremium) {
    return (
      <Alert className="border-primary bg-primary/5">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong className="font-semibold">Premium Access</strong> - Unlimited conversions
        </AlertDescription>
      </Alert>
    );
  }

  const percentage = Math.min((recordCount / TRIAL_LIMIT) * 100, 100);
  const isWarning = recordCount >= 40;
  const isExceeded = recordCount > TRIAL_LIMIT;

  return (
    <Alert className={isExceeded ? "border-destructive bg-destructive/5" : isWarning ? "border-primary bg-primary/5" : ""}>
      <AlertCircle className={`h-4 w-4 ${isExceeded ? "text-destructive" : isWarning ? "text-primary" : "text-muted-foreground"}`} />
      <AlertDescription className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium" data-testid="text-trial-status">
            Free Trial: {recordCount}/{TRIAL_LIMIT} records used
          </span>
          {isWarning && (
            <Button variant="outline" size="sm" onClick={onUpgrade} data-testid="button-upgrade-inline">
              Upgrade
            </Button>
          )}
        </div>
        <Progress value={percentage} className="h-2" data-testid="progress-trial-usage" />
        {isExceeded && (
          <p className="text-sm text-destructive">
            Trial limit exceeded. Please upgrade to convert files with more than {TRIAL_LIMIT} records.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
