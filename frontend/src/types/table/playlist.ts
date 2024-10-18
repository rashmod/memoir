import { Playlist, PlaylistCatalog } from '@/types/uploads/playlist';

export type BasicPlaylist = PlaylistCatalog[number] & { videos: Playlist };
