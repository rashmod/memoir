import { Playlist, PlaylistCatalog } from '@/types/uploads/playlist';
import processFile, { ProcessedFile } from '@/lib/process-file';

export default function processPlaylist(result: Array<NonNullable<Awaited<ReturnType<typeof processFile>>>>) {
  const [playlistCatalog] = result.filter((item) => item.folder === 'playlists' && item.file === 'playlists.csv') as [
    ProcessedFile<PlaylistCatalog, 'playlists'>,
  ];

  return result
    .filter((item) => item.folder === 'playlists' && item.file !== 'playlists.csv')
    .map((item) => mapToPlaylist(item as ProcessedFile<Playlist, 'playlists'>, playlistCatalog))
    .filter((item) => !!item);
}

function mapToPlaylist(
  playlist: ProcessedFile<Playlist, 'playlists'>,
  playlistCatalog: ProcessedFile<PlaylistCatalog, 'playlists'>
) {
  const name = playlist.file.split('-').slice(0, -1).join('');
  const details = playlistCatalog.data.find((item) => item.title === name);

  if (!details) return;

  return { ...details, videos: playlist.data };
}
