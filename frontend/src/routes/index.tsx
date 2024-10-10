import { createFileRoute } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Table from '@/videos/table';
import videosApi from '@/api/videos';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: videosApi.getHistory,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  // function onDeleteSelected() {
  //   setJsonData((prev) => prev.filter((item) => !rowSelection[item.youtubeId]));
  //   setRowSelection({});
  // }

  return (
    <div className="relative grid w-full gap-4">
      {isLoading && <div>Loading...</div>}
      {data && (
        <Table
          jsonData={data.data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
      {/* <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} /> */}
    </div>
  );
}
