import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import videosApi from '@/api/videos';
import { DataTable } from '@/components/custom/data-table';
import { loadingUserVideoTableColumns, userVideoTableColumns } from '@/columns/user-videos';

export const Route = createFileRoute('/videos/')({
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-videos'],
    queryFn: videosApi.getUserVideos,
  });

  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  return (
    <div className="relative grid w-full gap-4">
      {isLoading && (
        <DataTable
          data={Array(100).fill(null)}
          columns={loadingUserVideoTableColumns}
          pagination={{ state: pagination, setState: setPagination }}
        />
      )}
      {data && (
        <DataTable
          data={data.data}
          columns={userVideoTableColumns}
          rowSelection={{ state: rowSelection, setState: setRowSelection }}
          pagination={{ state: pagination, setState: setPagination }}
          onRowClick={(row) => navigate({ to: '/videos/$id', params: { id: row.videoId } })}
        />
      )}

      {/* <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} /> */}
    </div>
  );
}
