interface JsonToSqlOptions {
  tableName: string;
  sqlDialect: "mysql" | "postgresql" | "sqlite";
  flattenNested: boolean;
}

function escapeIdentifier(identifier: string, dialect: "mysql" | "postgresql" | "sqlite"): string {
  if (dialect === "mysql") {
    return `\`${identifier.replace(/`/g, "``")}\``;
  } else if (dialect === "postgresql") {
    return `"${identifier.replace(/"/g, '""')}"`;
  } else {
    return `"${identifier.replace(/"/g, '""')}"`;
  }
}

function escapeValue(value: unknown, dialect: "mysql" | "postgresql" | "sqlite"): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  
  if (typeof value === "number") {
    return value.toString();
  }
  
  if (typeof value === "boolean") {
    if (dialect === "postgresql") {
      return value ? "TRUE" : "FALSE";
    }
    return value ? "1" : "0";
  }
  
  if (typeof value === "object") {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  
  return `'${String(value).replace(/'/g, "''")}'`;
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

export function jsonToSql(jsonData: string, options: JsonToSqlOptions): { sql: string; tablesCreated: number; rowsProcessed: number } {
  const { tableName, sqlDialect, flattenNested } = options;
  
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
  
  // Extract column names from all records
  const columnSet = new Set<string>();
  processedRecords.forEach((record) => {
    if (typeof record === "object" && record !== null) {
      Object.keys(record as Record<string, unknown>).forEach((key) => columnSet.add(key));
    }
  });
  
  const columns = Array.from(columnSet);
  
  if (columns.length === 0) {
    throw new Error("No columns found in data");
  }
  
  // Generate CREATE TABLE statement
  const escapedTableName = escapeIdentifier(tableName, sqlDialect);
  let sql = `-- Table: ${tableName}\n`;
  sql += `DROP TABLE IF EXISTS ${escapedTableName};\n\n`;
  sql += `CREATE TABLE ${escapedTableName} (\n`;
  
  const columnDefinitions = columns.map((col) => {
    const escapedCol = escapeIdentifier(col, sqlDialect);
    
    // Infer data type from first non-null value
    let dataType = "TEXT";
    for (const record of processedRecords) {
      if (typeof record === "object" && record !== null) {
        const value = (record as Record<string, unknown>)[col];
        if (value !== null && value !== undefined) {
          if (typeof value === "number") {
            dataType = Number.isInteger(value) ? "INTEGER" : "DECIMAL";
          } else if (typeof value === "boolean") {
            dataType = "BOOLEAN";
          } else if (typeof value === "object") {
            dataType = sqlDialect === "postgresql" ? "JSONB" : "TEXT";
          }
          break;
        }
      }
    }
    
    return `  ${escapedCol} ${dataType}`;
  });
  
  sql += columnDefinitions.join(",\n");
  sql += "\n);\n\n";
  
  // Generate INSERT statements
  sql += `-- Insert data\n`;
  processedRecords.forEach((record) => {
    if (typeof record === "object" && record !== null) {
      const recordObj = record as Record<string, unknown>;
      const values = columns.map((col) => escapeValue(recordObj[col], sqlDialect));
      const escapedColumns = columns.map((col) => escapeIdentifier(col, sqlDialect));
      
      sql += `INSERT INTO ${escapedTableName} (${escapedColumns.join(", ")}) VALUES (${values.join(", ")});\n`;
    }
  });
  
  return {
    sql,
    tablesCreated: 1,
    rowsProcessed: processedRecords.length,
  };
}
