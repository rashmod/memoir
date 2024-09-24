import { createFileRoute } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import history from '@/data/watch-history.json';

import SelectionActionBar from '@/components/custom/selection-action-bar';
import filterJsonData from '@/lib/filter-json-data';
import { JsonSchema, VideosSchema } from '@/routes/upload';
import Table from '@/videos/table';

export const Route = createFileRoute('/')({
  component: Page,
});

console.log((history as any[])[0]);
console.log(Object.keys((history as any[])[0]));

const data = filterJsonData((history as JsonSchema).slice(0, 50));

function Page() {
  const [jsonData, setJsonData] = useState<VideosSchema>(data);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  function onDeleteSelected() {
    setJsonData((prev) => prev.filter((item) => !rowSelection[item.youtubeId]));
    setRowSelection({});
  }

  return (
    <div className="relative grid w-full gap-4">
      <Table videos={jsonData} rowSelection={rowSelection} setRowSelection={setRowSelection} />
      <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
    </div>
  );
}
