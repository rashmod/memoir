import { Playlist, PlaylistCatalog } from '@/types/uploads/playlist';

export type BasicPlaylistVideo = Playlist[number];

export type BasicPlaylist = PlaylistCatalog[number] & { videos: BasicPlaylistVideo[] };

export type DetailedPlaylistVideo = Playlist[number] & {
  title: string;
  url: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: string;
  new: boolean;
};

export type DetailedPlaylist = PlaylistCatalog[number] & {
  videos: DetailedPlaylistVideo[];
  new: boolean;
};
