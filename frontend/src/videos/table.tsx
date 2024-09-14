import { useQuery } from '@tanstack/react-query';

import history from '@/data/watch-history.json';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';
import axios from 'axios';

const initialData = (history as any[])
  .slice(0, 50)
  .filter((item) => !item.details)
  .filter((item) => item.titleUrl)
  .map((item) => ({
    ...item,
    url: item.titleUrl,
  }));

const ids = initialData
  .map((item) => {
    const [, url] = item.titleUrl.split('=');
    return 'id=' + url;
  })
  .join('&');

export default function Table() {
  const { data = [], isSuccess } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1000));
      const response = await axios(
        `https://youtube.googleapis.com/youtube/v3/videos?part=id&part=snippet&${ids}&key=AIzaSyDFofEQXnBEX5pmJA2B3_2RYa660-9YcNk`
      );

      console.log(response.data);

      return response.data;
    },
  });
    }


  return <DataTable data={data} columns={cols} />;
}
