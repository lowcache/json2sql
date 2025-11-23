interface JsonToCsvOptions {
  delimiter: string;
  flattenNested: boolean;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;
    
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

function escapeCsvValue(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) {
    return "";
  }
  
  let stringValue = String(value);
  
  // If value contains delimiter, newline, or quotes, wrap in quotes and escape quotes
  if (stringValue.includes(delimiter) || stringValue.includes("\n") || stringValue.includes('"')) {
    stringValue = `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function extractRecordsFromData(data: unknown, flattenNested: boolean): unknown[] {
  // If it's already an array, use it directly
  if (Array.isArray(data)) {
    return data;
  }
  
  // If it's an object and we should flatten, extract arrays from it
  if (typeof data === "object" && data !== null && flattenNested) {
    const obj = data as Record<string, unknown>;
    
    // Find all array properties
    const arrayValues: unknown[] = [];
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        arrayValues.push(...value);
      }
    }
    
    // If we found arrays, use their combined items
    if (arrayValues.length > 0) {
      return arrayValues;
    }
  }
  
  // Single object fallback
  return [data];
}

export function jsonToCsv(jsonData: string, options: JsonToCsvOptions): { csv: string; headersDetected: number; rowsProcessed: number } {
  const { delimiter, flattenNested } = options;
  
  let data: unknown;
  try {
    data = JSON.parse(jsonData);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
  
  // Extract records intelligently based on structure
  const records = extractRecordsFromData(data, flattenNested);
  
  if (records.length === 0) {
    throw new Error("No data to convert");
  }
  
  // Process records - flatten nested objects within each record
  const processedRecords = flattenNested
    ? records.map((record) => {
        if (typeof record === "object" && record !== null) {
          return flattenObject(record as Record<string, unknown>);
        }
        return record;
      })
    : records;
  
  // Extract column names (headers) from all records
  const columnSet = new Set<string>();
  processedRecords.forEach((record) => {
    if (typeof record === "object" && record !== null) {
      Object.keys(record as Record<string, unknown>).forEach((key) => columnSet.add(key));
    }
  });
  
  const headers = Array.from(columnSet);
  
  if (headers.length === 0) {
    throw new Error("No headers found in data");
  }
  
  // Generate CSV
  let csv = "";
  
  // Add header row
  csv += headers.map((header) => escapeCsvValue(header, delimiter)).join(delimiter) + "\n";
  
  // Add data rows
  processedRecords.forEach((record) => {
    if (typeof record === "object" && record !== null) {
      const recordObj = record as Record<string, unknown>;
      const rowValues = headers.map((header) => {
        const value = recordObj[header];
        // Convert objects/arrays to JSON strings
        if (typeof value === "object" && value !== null) {
          return escapeCsvValue(JSON.stringify(value), delimiter);
        }
        return escapeCsvValue(value, delimiter);
      });
      csv += rowValues.join(delimiter) + "\n";
    }
  });
  
  return {
    csv,
    headersDetected: headers.length,
    rowsProcessed: processedRecords.length,
  };
}
