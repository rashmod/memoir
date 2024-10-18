import JSZip from 'jszip';
import Papa from 'papaparse';
import { z } from 'zod';

export default async function processCsvFile<T extends z.Schema>({
  zipEntry,
  validationSchema,
}: {
  zipEntry: JSZip.JSZipObject;
  validationSchema: T;
}): Promise<z.infer<T> | null> {
  const csvContent = await zipEntry.async('string');
  const parsedCsv = Papa.parse(csvContent, { header: true });
  const validCsv = filterValidCsvRows(parsedCsv); // remove invalid rows
  const result = validationSchema.safeParse(validCsv);

  if (result.success) {
    return result.data;
  } else {
    console.error(result.error);
    return null;
  }
}

function filterValidCsvRows(csv: Papa.ParseResult<unknown>) {
  return csv.data.filter((_, i) => !csv.errors.find((error) => error.row === i));
}
