export type BasicVideo = {
  videoId: string;
  title: string;
  url: string;
  watchedAt: string;
  channelName: string | undefined;
  channelUrl: string | undefined;
};

export type DetailedVideo = BasicVideo & {
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
  youtubeCreatedAt: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
  watchCount: number;
  playlists: string[];
};

export type UserVideoDetails = {
  video: {
    videoId: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    duration: number;
    youtubeCreatedAt: string;
    channelId: string;
    channelName: string;
    channelUrl: string;
    channelAvatarUrl: string;
    channelCreatedAt: string;
  };
  history: UserVideoDetailsHistory[];
  playlists: UserVideoDetailsPlaylist[];
};

export type UserVideoDetailsHistory = {
  watchedAt: string;
};

export type UserVideoDetailsPlaylist = {
  playlistId: string;
  playlistName: string;
  addedAt: string;
};
