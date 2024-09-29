import axios from "axios";
import env from "@/config/env";
import chunkArray from "@/lib/chunk-array";

export default class YoutubeService {
  private readonly YOUTUBE_API_BASE_URL =
    "https://youtube.googleapis.com/youtube/v3";

  private readonly videoParts = ["id", "snippet", "contentDetails"]
    .map((item) => "part=" + item)
    .join("&");

  private readonly channelParts = ["id", "snippet"]
    .map((item) => "part=" + item)
    .join("&");

  private readonly YOUTUBE_CHUNK_SIZE = 50;

  async getVideos(videoIds: string[]): Promise<YoutubeVideoResponse[]> {
    const chunkedVideoIds = chunkArray(videoIds, this.YOUTUBE_CHUNK_SIZE);
    const params = this.generateIdParams(chunkedVideoIds);

    return await Promise.all(params.map((ids) => this.getVideoDetails(ids)));
  }

  async getChannels(channelIds: string[]): Promise<YoutubeChannelResponse[]> {
    const chunkedChannelIds = chunkArray(channelIds, this.YOUTUBE_CHUNK_SIZE);
    const params = this.generateIdParams(chunkedChannelIds);

    return await Promise.all(params.map((ids) => this.getChannelDetails(ids)));
  }

  getThumbnailUrl(
    thumbnails: YoutubeVideoResponse["items"][number]["snippet"]["thumbnails"],
  ) {
    const resolutions: Array<keyof typeof thumbnails> = [
      "high",
      "medium",
      "default",
      "maxres",
      "standard",
    ];

    for (const res of resolutions) {
      if (thumbnails[res]) {
        return thumbnails[res]!.url;
      }
    }

    return null as never;
  }

  private generateIdParams(ids: string[][]) {
    return ids.map((list) => list.map((id) => "id=" + id).join("&"));
  }

  private async getVideoDetails(ids: string): Promise<YoutubeVideoResponse> {
    const response = await axios.get(
      `${this.YOUTUBE_API_BASE_URL}/videos?${this.videoParts}&${ids}&key=${env.YOUTUBE_API_KEY}`,
    );

    return response.data;
  }

  private async getChannelDetails(
    ids: string,
  ): Promise<YoutubeChannelResponse> {
    const response = await axios.get(
      `${this.YOUTUBE_API_BASE_URL}/channels?${this.channelParts}&${ids}&key=${env.YOUTUBE_API_KEY}`,
    );

    return response.data;
  }
}

export type YoutubeVideoResponse = {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string; // date;
      channelId: string;
      title: string;
      description: string;
      thumbnails: Partial<
        Record<
          "default" | "medium" | "high" | "standard" | "maxres",
          { url: string; widht: number; height: number }
        >
      >;
      channelTitle: string;
      categoryId: string;
      liveBroadcastContent: string;
      defaultLanguage: string;
      localized: {
        title: string;
        description: string;
      };
      defaultAudioLanguage: string;
    };
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
      contentRating: {};
      projection: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

type YoutubeChannelResponse = {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl: string;
      publishedAt: string; // date;
      thumbnails: Partial<
        Record<
          "default" | "medium" | "high",
          { url: string; widht: number; height: number }
        >
      >;
      defaultLanguage: string;
      localized: {
        title: string;
        description: string;
      };
      country: string;
    };
  }[];
};
