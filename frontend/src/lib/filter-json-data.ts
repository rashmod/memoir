import { ImportedVideo } from '@/videos/types';

export default function filterJsonData(data: ImportedVideo) {
  return data
    .filter(hasNoDetails)
    .filter((item) => 'titleUrl' in item)
    .map((item) => {
      const subtitles = 'subtitles' in item && item.subtitles && item.subtitles.length > 0 ? item.subtitles : null;

      const channelTitle = subtitles ? subtitles[0]!.name : undefined;
      const channelUrl = subtitles ? subtitles[0]!.url : undefined;
      const title = item.title.replace('Watched ', '');
      const url = item.titleUrl;
      const [, youtubeId] = url.split('=');
      const time = item.time;

      return { title, channelTitle, channelUrl, url, time, youtubeId: youtubeId! };
    });
}

function hasNoDetails(item: ImportedVideo[number]): item is Exclude<typeof item, { details: any }> {
  return !('details' in item);
}
