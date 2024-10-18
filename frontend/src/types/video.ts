export type BasicVideo = {
  youtubeId: string;
  title: string;
  url: string;
  time: string;
  channelTitle: string | undefined;
  channelUrl: string | undefined;
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
