import { ImportedVideo } from '@/videos/types';

export default function filterJsonData(data: ImportedVideo) {
  return data
    .filter((item) => !item.details)
    .filter((item) => item.titleUrl)
    .map((item) => {
      const subtitles = item.subtitles;

      const channelTitle = subtitles ? subtitles[0].name : undefined;
      const channelUrl = subtitles ? subtitles[0].url : undefined;
      const title = item.title.replace('Watched ', '');
      const url = item.titleUrl!;
      const [, youtubeId] = url.split('=');
      const time = item.time;

      return { title, channelTitle, channelUrl, url, youtubeId, time };
    });
}
