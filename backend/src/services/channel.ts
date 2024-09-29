import { channel } from "@/db/schema";
import chunkArray from "@/lib/chunk-array";
import ChannelRepository from "@/repositories/channel";

export default class ChannelService {
  constructor(private readonly channelRepository: ChannelRepository) {
    this.channelRepository = channelRepository;
  }

  async bulkCreate(channels: (typeof channel.$inferInsert)[][]) {
    return await Promise.all(channels.map((chunk) => this.create(chunk)));
  }

  async create(channels: (typeof channel.$inferInsert)[]) {
    return await this.channelRepository.create(channels);
  }

  async getMissingChannelIds(channelIdSet: Set<string>, chunkSize: number) {
    const chunks = chunkArray(Array.from(channelIdSet), chunkSize);
    const existingChannelIds = await Promise.all(
      chunks.map((ids) => this.channelRepository.getExisting(ids)),
    );

    for (const ids of existingChannelIds) {
      for (const id of ids) {
        channelIdSet.delete(id.youtubeId);
      }
    }

    return [Array.from(channelIdSet), existingChannelIds] as const;
  }
}
