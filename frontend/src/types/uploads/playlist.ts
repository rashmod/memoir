import { z } from 'zod';

export const playlistSchema = z.array(
  z
    .object({
      'Playlist Video Creation Timestamp': z.string().trim().datetime({ offset: true }),
      'Video ID': z.string().trim().length(11),
    })
    .transform((data) => ({
      videoId: data['Video ID'],
      addedAt: data['Playlist Video Creation Timestamp'],
    }))
);

export type Playlist = z.infer<typeof playlistSchema>;

export const playlistCatalogSchema = z.array(
  z
    .object({
      'Playlist ID': z.string().trim().length(34),
      // 'Add new videos to top': z.enum(['True', 'False']).transform((x) => x === 'True'),
      // 'Playlist Image 1 Create Timestamp': '',
      // 'Playlist Image 1 URL': '',
      // 'Playlist Image 1 Height': '',
      // 'Playlist Image 1 Width': '',
      'Playlist Title (Original)': z.string().trim(),
      // 'Playlist Title (Original) Language': '',
      'Playlist Create Timestamp': z.string().trim().datetime({ offset: true }),
      'Playlist Update Timestamp': z.string().trim().datetime({ offset: true }),
      // 'Playlist Video Order': 'Manual',
      'Playlist Visibility': z.string().trim(),
    })
    .transform((data) => ({
      id: data['Playlist ID'],
      title: data['Playlist Title (Original)'],
      createdAt: data['Playlist Create Timestamp'],
      updatedAt: data['Playlist Update Timestamp'],
      visibility: data['Playlist Visibility'],
    }))
);

export type PlaylistCatalog = z.infer<typeof playlistCatalogSchema>;
