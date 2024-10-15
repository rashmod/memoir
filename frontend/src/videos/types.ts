import { z } from 'zod';

export const importedVideoSchema = z.array(
  z.object({
    title: z.string(),
    titleUrl: z.string().optional(),
    time: z.string().datetime(),
    subtitles: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    details: z.any().optional(),
  })
);

export type ImportedVideo = z.infer<typeof importedVideoSchema>;

export type BasicVideo = {
  youtubeId: string;
  title: string;
  url: string;
  time: string;
};

export type DetailedVideo = BasicVideo & {
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: Date;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
};

export type MergedVideo = BasicVideo | DetailedVideo;

export type FinalVideo = Omit<DetailedVideo, 'time'> & {
  lastWatchedAt: string;
  watchCount?: number;
};

export type HistoryVideo = {
  id: string;
  youtubeCreatedAt: string;
};
