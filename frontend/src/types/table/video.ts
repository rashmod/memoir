export type BasicVideo = {
  youtubeId: string;
  title: string;
  url: string;
  time: string;
  channelName: string | undefined;
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

export type FinalVideo = Omit<DetailedVideo, 'time'> & {
  lastWatchedAt: string;
  watchCount?: number;
};

export type HistoryVideo = {
  id: string;
  youtubeCreatedAt: string;
};

export type BasicVideoNew = {
  videoId: string;
  title: string;
  url: string;
  watchedAt: string;
  channelName: string | undefined;
  channelUrl: string | undefined;
};

export type DetailedVideoNew = BasicVideoNew & {
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
};

export type UserVideo = {
  videoId: string;
  title: string;
  url: string;
  lastWatchedAt: string | null;
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: Date;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
  watchCount: number;
  playlists: string[];
};
