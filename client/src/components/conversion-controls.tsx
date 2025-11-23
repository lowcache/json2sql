import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Loader2 } from "lucide-react";

interface ConversionOptions {
  tableName?: string;
  sqlDialect?: "mysql" | "postgresql" | "sqlite";
  csvDelimiter?: string;
  flattenNested?: boolean;
}

interface ConversionControlsProps {
  format: "sql" | "csv";
  onFormatChange: (format: "sql" | "csv") => void;
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  onConvert: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ConversionControls({
  format,
  onFormatChange,
  options,
  onOptionsChange,
  onConvert,
  disabled,
  loading,
}: ConversionControlsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">Output Format</Label>
          <RadioGroup
            value={format}
            onValueChange={(value) => onFormatChange(value as "sql" | "csv")}
            disabled={disabled}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sql" id="format-sql" data-testid="radio-format-sql" />
              <Label htmlFor="format-sql" className="cursor-pointer">SQL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="format-csv" data-testid="radio-format-csv" />
              <Label htmlFor="format-csv" className="cursor-pointer">CSV</Label>
            </div>
          </RadioGroup>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="options">
            <AccordionTrigger data-testid="button-toggle-options">Advanced Options</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                {format === "sql" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="table-name">Table Name</Label>
                      <Input
                        id="table-name"
                        placeholder="data_table"
                        value={options.tableName || ""}
                        onChange={(e) => onOptionsChange({ ...options, tableName: e.target.value })}
                        disabled={disabled}
                        data-testid="input-table-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sql-dialect">SQL Dialect</Label>
                      <Select
                        value={options.sqlDialect || "postgresql"}
                        onValueChange={(value) =>
                          onOptionsChange({ ...options, sqlDialect: value as "mysql" | "postgresql" | "sqlite" })
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger id="sql-dialect" data-testid="select-sql-dialect">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgresql">PostgreSQL</SelectItem>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {format === "csv" && (
                  <div className="space-y-2">
                    <Label htmlFor="csv-delimiter">CSV Delimiter</Label>
                    <Input
                      id="csv-delimiter"
                      placeholder=","
                      value={options.csvDelimiter || ","}
                      onChange={(e) => onOptionsChange({ ...options, csvDelimiter: e.target.value })}
                      disabled={disabled}
                      maxLength={1}
                      data-testid="input-csv-delimiter"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="flatten-nested" className="cursor-pointer">
                    Flatten Nested Objects
                  </Label>
                  <Switch
                    id="flatten-nested"
                    checked={options.flattenNested ?? true}
                    onCheckedChange={(checked) => onOptionsChange({ ...options, flattenNested: checked })}
                    disabled={disabled}
                    data-testid="switch-flatten-nested"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={onConvert}
          disabled={disabled || loading}
          className="w-full"
          size="lg"
          data-testid="button-convert"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              Convert to {format.toUpperCase()}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
