import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { countRecordsForConversion } from "@/utils/count-records";

interface TextPasteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextPaste({ value, onChange, disabled }: TextPasteProps) {
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    const count = countRecordsForConversion(value);
    setRecordCount(count);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch (error) {
      // Invalid JSON, don't format
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground" data-testid="text-record-count">
            {recordCount} {recordCount === 1 ? "record" : "records"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFormat}
          disabled={disabled || !value}
          data-testid="button-format-json"
        >
          Format JSON
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Paste your JSON here..."
        className="min-h-[300px] font-mono text-sm resize-none"
        data-testid="textarea-json-input"
      />
    </Card>
  );
}
