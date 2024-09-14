import { useEffect } from 'react';

import history from '@/data/watch-history.json';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';

const data = (history as any[])
  .slice(0, 50)
  .filter((item) => !item.details)
  .filter((item) => item.titleUrl)
  .map((item) => ({
    ...item,
    url: item.titleUrl,
  }));

const ids = data
  .map((item) => {
    const [, url] = item.titleUrl.split('=');
    return 'id=' + url;
  })
  .join('&');
console.log(ids);

export default function Table() {
  useEffect(() => {
    async function getData() {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=id&part=snippet&${ids}&key=AIzaSyDFofEQXnBEX5pmJA2B3_2RYa660-9YcNk`
      );
      const data = await response.json();

      console.log(data);
    }

    getData();
  }, []);

  return <DataTable data={data} columns={cols} />;
}
