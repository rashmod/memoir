import { createFileRoute } from '@tanstack/react-router';

import history from '@/data/watch-history.json';
import Table from '@/videos/table';

export const Route = createFileRoute('/')({
  component: Page,
});

console.log((history as any[])[0]);
console.log(Object.keys((history as any[])[0]));

const data = (history as any[])
  .slice(0, 50)
  .filter((item) => !item.details)
  .filter((item) => item.titleUrl)
  .map((item) => {
    const subtitles = item.subtitles;

    const channelTitle = subtitles ? subtitles[0].name : undefined;
    const channelUrl = subtitles ? subtitles[0].url : undefined;

    return {
      ...item,
      title: item.title.replace('Watched ', ''),
      url: item.titleUrl,
      channelTitle,
      channelUrl,
    };
  });

function Page() {
  return <Table videos={data} />;
}
