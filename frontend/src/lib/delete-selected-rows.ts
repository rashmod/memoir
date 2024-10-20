import { RowSelectionState } from '@tanstack/react-table';
import { uploadedData } from '@/routes/upload';
import { BasicVideoNew } from '@/types/table/video';

export function deleteSelectedRows(input: {
  selected: RowSelectionState;
  key: 'playlists';
  index: number;
  setData: React.Dispatch<React.SetStateAction<uploadedData>>;
}): void;

export function deleteSelectedRows(input: {
  selected: RowSelectionState;
  key: Exclude<keyof uploadedData, 'key' | 'playlists'> | 'unique';
  setData: React.Dispatch<React.SetStateAction<uploadedData>>;
}): void;

export function deleteSelectedRows({
  selected,
  key,
  index,
  setData,
}: {
  selected: RowSelectionState;
  key: Exclude<keyof uploadedData, 'key'> | 'unique';
  index?: number;
  setData: React.Dispatch<React.SetStateAction<uploadedData>>;
}) {
  if (key === 'playlists') {
    if (index === undefined) throw new Error('Index is undefined');

    setData((prev) => ({
      ...prev,
      playlists: prev.playlists.map((playlist, i) => ({
        ...playlist,
        videos: i === index ? playlist.videos.filter((_, idx) => !selected[idx]) : playlist.videos,
      })),
    }));
  } else if (key === 'unique') {
    setData((prev) => {
      const history = prev.history.filter((video) => !selected[video.videoId]) as BasicVideoNew[];
      const playlists = prev.playlists.map((playlist) => ({
        ...playlist,
        videos: playlist.videos.filter((video) => !selected[video.videoId]),
      }));

      return { ...prev, history, playlists };
    });
  } else {
    setData((prev) => ({ ...prev, [key]: prev[key].filter((_, index) => !selected[index]) }));
  }
}
