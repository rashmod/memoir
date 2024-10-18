import { Playlist, PlaylistCatalog, playlistCatalogSchema, playlistSchema } from '@/types/uploads/playlist';
import { Subscription, subscriptionSchema } from '@/types/uploads/subscription';
import { watchHistorySchema } from '@/types/uploads/watch-history';
import { BasicVideo } from '@/types/table/video';
import JSZip from 'jszip';
import processJsonFile from './process-json-file';
import processCsvFile from './process-csv-file';
import { z } from 'zod';

export default async function processFile(
  zipEntry: JSZip.JSZipObject
): Promise<
  | ProcessedFile<BasicVideo[], 'history'>
  | ProcessedFile<Playlist | PlaylistCatalog, 'playlists'>
  | ProcessedFile<Subscription, 'subscriptions'>
  | undefined
> {
  const { name } = zipEntry;

  const [, , folderName, fileName] = name.split('/');

  if (!folderName || !fileName) return;
  const schemaMap: Record<string, z.Schema<unknown>> = {
    history: watchHistorySchema,
    playlists: fileName === 'playlists.csv' ? playlistCatalogSchema : playlistSchema,
    subscriptions: subscriptionSchema,
  };

  const validationSchema = schemaMap[folderName];

  if (!validationSchema) return undefined;

  switch (folderName) {
    case 'history': {
      if (fileName === 'watch-history.json') {
        const data = await processJsonFile(zipEntry);

        if (!data) return;

        return { folder: folderName, file: fileName, data };
      }
      return;
    }

    case 'playlists': {
      if (fileName === 'playlists.csv') {
        const data = await processCsvFile({
          zipEntry,
          validationSchema: playlistCatalogSchema,
        });

        if (!data) return;

        return { folder: folderName, file: fileName, data };
      } else {
        const data = await processCsvFile({
          zipEntry,
          validationSchema: playlistSchema,
        });

        if (!data) return;

        return { folder: folderName, file: fileName, data };
      }
    }

    case 'subscriptions': {
      const data = await processCsvFile({
        zipEntry,
        validationSchema: subscriptionSchema,
      });

      if (!data) return;

      return { folder: folderName, file: fileName, data };
    }
    default:
      return;
  }
}

export type ProcessedFile<T, U extends string> = {
  folder: U;
  file: string;
  data: T;
};
