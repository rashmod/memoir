import history from '@/data/watch-history.json';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';

const data = (history as any[])
  .slice(0, 1000)
  .filter((item) => !item.details)
  .filter((item) => item.titleUrl)
  .map((item) => ({
    ...item,
    url: item.titleUrl,
  }));

export default function Table() {
  return <DataTable data={data} columns={cols} />;
}
