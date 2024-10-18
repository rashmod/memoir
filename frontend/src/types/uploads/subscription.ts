import { z } from 'zod';

export const subscriptionSchema = z.array(
  z
    .object({
      'Channel Id': z.string().trim().length(24),
      'Channel Url': z.string().trim().url(),
      'Channel Title': z.string().trim(),
    })
    .transform((data) => ({
      id: data['Channel Id'],
      url: data['Channel Url'],
      title: data['Channel Title'],
    }))
);

export type Subscription = z.infer<typeof subscriptionSchema>;
