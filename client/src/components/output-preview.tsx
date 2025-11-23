import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ConversionResult } from "@shared/schema";

interface OutputPreviewProps {
  result: ConversionResult | null;
  loading?: boolean;
}

export function OutputPreview({ result, loading }: OutputPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Output has been copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result.output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_data.${result.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-sm text-muted-foreground">Processing conversion...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="p-6">
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Output will appear here after conversion
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Conversion Complete</p>
              <div className="flex gap-4 text-sm text-muted-foreground" data-testid="text-conversion-stats">
                <span>{result.statistics.rowsProcessed} rows processed</span>
                {result.statistics.tablesCreated && <span>{result.statistics.tablesCreated} tables created</span>}
                {result.statistics.headersDetected && <span>{result.statistics.headersDetected} headers detected</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-testid="button-copy-output"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              data-testid="button-download-output"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Textarea
          value={result.output}
          readOnly
          className="min-h-[300px] font-mono text-sm resize-none"
          data-testid="textarea-output-preview"
        />
      </div>
    </Card>
  );
}
