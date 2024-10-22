import { WatchHistory } from '@/types/uploads/watch-history';
import { BasicVideo } from '@/types/table/video';

export default function processWatchHistory(data: WatchHistory): BasicVideo[] {
  return data
    .filter(hasNoDetails)
    .filter((item) => 'titleUrl' in item)
    .map((item) => {
      const subtitles = 'subtitles' in item && item.subtitles && item.subtitles.length > 0 ? item.subtitles : null;

      const channelName = subtitles ? subtitles[0]!.name : undefined;
      const channelUrl = subtitles ? subtitles[0]!.url : undefined;
      const title = item.title.replace('Watched ', '');
      const url = item.titleUrl;
      const [, videoId] = url.split('=');
      const time = item.time;

      return { title, channelName, channelUrl, url, watchedAt: time, videoId: videoId! };
    });
}

function hasNoDetails(item: WatchHistory[number]): item is Exclude<typeof item, { details: any }> {
  return !('details' in item);
}
