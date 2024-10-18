import JSZip from 'jszip';

import { watchHistorySchema } from '@/types/uploads/watch-history';
import processWatchHistory from '@/lib/process-watch-history';

export default async function processJsonFile(zipEntry: JSZip.JSZipObject) {
  const jsonContent = await zipEntry.async('string');
  try {
    const parsedJson = JSON.parse(jsonContent);
    const result = watchHistorySchema.safeParse(parsedJson);

    if (result.success) {
      const formattedData = processWatchHistory(result.data);
      return formattedData;
    } else {
      console.error(result.error);
      return null;
    }
  } catch (error) {
    console.error('Error parsing JSON file:', error);
    return null;
  }
}
