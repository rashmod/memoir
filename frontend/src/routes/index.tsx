import { createFileRoute } from '@tanstack/react-router';

import history from '@/data/watch-history.json';
import Table from '@/videos/table';
import { JsonSchema } from '@/routes/upload';
import filterJsonData from '@/lib/filterJsonData';

export const Route = createFileRoute('/')({
  component: Page,
});

console.log((history as any[])[0]);
console.log(Object.keys((history as any[])[0]));

const data = filterJsonData((history as JsonSchema).slice(0, 50));

function Page() {
  return <Table videos={data} />;
}
