/**
 * Count the actual number of records that will be processed after conversion.
 * This matches the backend's processing logic with flattenNested=true:
 * - Top-level arrays: each item is a row
 * - Top-level object with array properties: each item in arrays becomes a row
 * - Top-level object without arrays: 1 row
 */
export function countRecordsForConversion(jsonData: string): number {
  try {
    const parsed = JSON.parse(jsonData);
    
    // If it's an array at top level, each item becomes a row
    if (Array.isArray(parsed)) {
      return parsed.length;
    }
    
    // If it's an object, check for array properties
    if (typeof parsed === "object" && parsed !== null) {
      const obj = parsed as Record<string, unknown>;
      let totalRecords = 0;
      
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
          totalRecords += value.length;
        }
      }
      
      // If we found arrays, return their total count
      if (totalRecords > 0) {
        return totalRecords;
      }
    }
    
    // Single object without arrays counts as 1 row
    return 1;
  } catch {
    return 0;
  }
}
