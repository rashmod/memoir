import { createFileRoute } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import history from '@/data/watch-history.json';

import SelectionActionBar from '@/components/custom/selection-action-bar';
import filterJsonData from '@/lib/filter-json-data';
import Table from '@/videos/table';
import { ImportedVideo, MergedVideo } from '@/videos/types';

export const Route = createFileRoute('/')({
  component: Page,
});

console.log((history as any[])[0]);
console.log(Object.keys((history as any[])[0]));

const data = filterJsonData((history as ImportedVideo).slice(0, 50));

function Page() {
  const [jsonData, setJsonData] = useState<MergedVideo[]>(data);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  function onDeleteSelected() {
    setJsonData((prev) => prev.filter((item) => !rowSelection[item.youtubeId]));
    setRowSelection({});
  }

  return (
    <div className="relative grid w-full gap-4">
      <Table
        jsonData={jsonData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        pagination={pagination}
        setPagination={setPagination}
      />
      <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
    </div>
  );
}
