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

export const watchHistorySchema = z.array(z.union([videoSchema, removedVideoSchema, adSchema, questionnaireSchema]));

export type WatchHistory = z.infer<typeof watchHistorySchema>;
