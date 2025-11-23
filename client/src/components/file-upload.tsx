import { useCallback, useState } from "react";
import { Upload, X, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const jsonFile = files.find((f) => f.name.endsWith(".json"));

      if (jsonFile) {
        const content = await jsonFile.text();
        setSelectedFile({ name: jsonFile.name, size: jsonFile.size });
        onFileSelect(content, jsonFile.name);
      }
    },
    [onFileSelect, disabled]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const content = await file.text();
        setSelectedFile({ name: file.name, size: file.size });
        onFileSelect(content, file.name);
      }
    },
    [onFileSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    onFileSelect("", "");
  }, [onFileSelect]);

  return (
    <Card className="p-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative min-h-[300px] border-2 border-dashed rounded-lg
          flex flex-col items-center justify-center gap-4
          transition-colors cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover-elevate"}
        `}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          data-testid="input-file-upload"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <FileJson className="w-12 h-12 text-primary" />
            <div className="text-center">
              <p className="font-medium text-foreground" data-testid="text-filename">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              data-testid="button-clear-file"
            >
              <X className="w-4 h-4 mr-2" />
              Clear File
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Drop JSON file or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports .json files up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
