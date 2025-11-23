import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { TextPaste } from "@/components/text-paste";
import { ConversionControls } from "@/components/conversion-controls";
import { TrialBadge } from "@/components/trial-badge";
import { OutputPreview } from "@/components/output-preview";
import { UpgradeModal } from "@/components/upgrade-modal";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ConversionResult, ConversionRequest } from "@shared/schema";
import { countRecordsForConversion } from "@/utils/count-records";
import { useUser } from "@/hooks/use-user";

const TRIAL_LIMIT = 50;

export default function Home() {
  const [inputMethod, setInputMethod] = useState<"upload" | "paste">("upload");
  const [jsonData, setJsonData] = useState("");
  const [format, setFormat] = useState<"sql" | "csv">("sql");
  const [options, setOptions] = useState<{
    tableName?: string;
    sqlDialect?: "postgresql" | "mysql" | "sqlite";
    csvDelimiter?: string;
    flattenNested?: boolean;
  }>({
    tableName: "data_table",
    sqlDialect: "postgresql",
    csvDelimiter: ",",
    flattenNested: true,
  });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const { user, upgradeUser } = useUser();
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (request: ConversionRequest) => {
      const response = await apiRequest("POST", "/api/convert", request);
      return await response.json() as ConversionResult;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Conversion successful",
        description: `Your JSON has been converted to ${format.toUpperCase()}`,
      });
    },
    onError: async (error: Error) => {
      // Check if this is a trial limit error from backend
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("trial limit") || errorMessage.includes("403")) {
        setUpgradeModalOpen(true);
      }
      
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (content: string) => {
    setJsonData(content);
    setResult(null);
  };

  const handlePasteChange = (content: string) => {
    setJsonData(content);
    setResult(null);
  };

  const handleConvert = () => {
    if (!jsonData.trim()) {
      toast({
        title: "No input provided",
        description: "Please upload a file or paste JSON data",
        variant: "destructive",
      });
      return;
    }

    // Validate JSON
    try {
      JSON.parse(jsonData);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON data",
        variant: "destructive",
      });
      return;
    }

    // Frontend estimation - backend will enforce accurately
    const estimatedRecords = countRecordsForConversion(jsonData);
    if (!user.isPremium && estimatedRecords > TRIAL_LIMIT) {
      toast({
        title: "Trial limit exceeded",
        description: `Free trial is limited to ${TRIAL_LIMIT} records. You have approximately ${estimatedRecords} records.`,
        variant: "destructive",
      });
      setUpgradeModalOpen(true);
      return;
    }

    convertMutation.mutate({
      jsonData,
      format,
      options: {
        tableName: options.tableName || "data_table",
        sqlDialect: format === "sql" ? options.sqlDialect : undefined,
        csvDelimiter: format === "csv" ? options.csvDelimiter : undefined,
        flattenNested: options.flattenNested,
      },
    });
  };

  // Calculate estimated record count for trial tracking
  const recordCount = countRecordsForConversion(jsonData);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader isPremium={user.isPremium} onUpgrade={() => setUpgradeModalOpen(true)} />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <TrialBadge
              recordCount={recordCount}
              onUpgrade={() => setUpgradeModalOpen(true)}
              isPremium={user.isPremium}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Input JSON</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a JSON file or paste your data directly
                </p>
              </div>

              <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "upload" | "paste")}>
                <TabsList className="grid w-full grid-cols-2" data-testid="tabs-input-method">
                  <TabsTrigger value="upload" data-testid="tab-upload">Upload File</TabsTrigger>
                  <TabsTrigger value="paste" data-testid="tab-paste">Paste JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-6">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    disabled={convertMutation.isPending}
                  />
                </TabsContent>
                <TabsContent value="paste" className="mt-6">
                  <TextPaste
                    value={jsonData}
                    onChange={handlePasteChange}
                    disabled={convertMutation.isPending}
                  />
                </TabsContent>
              </Tabs>

              <ConversionControls
                format={format}
                onFormatChange={setFormat}
                options={options}
                onOptionsChange={setOptions}
                onConvert={handleConvert}
                disabled={!jsonData.trim() || convertMutation.isPending}
                loading={convertMutation.isPending}
              />
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Output Preview</h2>
                <p className="text-sm text-muted-foreground">
                  Download or copy your converted data
                </p>
              </div>

              <OutputPreview
                result={result}
                loading={convertMutation.isPending}
              />
            </div>
          </div>
        </div>
      </main>

      <AppFooter />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        onUpgradeSuccess={upgradeUser}
      />
    </div>
  );
}
