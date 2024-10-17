import { z } from 'zod';

/*
 * ads will have details field
 * some entries may not have subtitles field
 * entries without subtitles field may be removed or made private
 * shorts may not have subtitles field
 * videos may not have subtitles
 * surveys will not have titleUrl field
 */

const baseSchema = z.object({
  title: z.string(),
  time: z.string().datetime(),
});

// same for shorts
const videoSchema = baseSchema.extend({
  titleUrl: z.string(),
  subtitles: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

const removedVideoSchema = baseSchema.extend({
  titleUrl: z.string(),
});

const questionnaireSchema = baseSchema.extend({
  subtitles: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

const adSchema = baseSchema.extend({
  titleUrl: z.string(),
  details: z.object({ name: z.string() }),
});

const schema = z.union([videoSchema, removedVideoSchema, adSchema, questionnaireSchema]);

export const importedVideoSchema = z.array(schema);

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
