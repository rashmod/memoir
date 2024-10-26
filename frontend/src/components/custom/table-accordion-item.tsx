import { useMemo, useState } from 'react';
import { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { DataTable } from '@/components/custom/data-table';
import SelectionActionBar from '@/components/custom/selection-action-bar';

export default function TableAccordionItem<TData, TValue>({
  id,
  title,
  columns,
  data,
  onDeleteSelectedRows,
  getRowId,
  getRowClassName,
}: {
  id: string;
  title: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  onDeleteSelectedRows: (selected: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
  getRowClassName?: (row: TData) => string;
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  function onDeleteSelected() {
    onDeleteSelectedRows(rowSelection);
    setRowSelection({});
  }

  return (
    <AccordionItem value={id} className="rounded-md border">
      <AccordionTrigger className="group rounded-md bg-muted px-4 py-2 text-sm font-normal hover:no-underline data-[state=open]:rounded-b-none">
        <p className="group-hover:underline">{title}</p>
        <Badge className="-mb-0.5 font-medium hover:no-underline">{data.length}</Badge>
      </AccordionTrigger>
      <AccordionContent className="grid w-full gap-4">
        <DataTable
          data={data}
          columns={columns}
          rowSelection={{ state: rowSelection, setState: setRowSelection }}
          pagination={{ state: pagination, setState: setPagination }}
          getRowId={getRowId}
          getRowClassName={getRowClassName}
          tableContainerClassName="rounded-none border-0 border-t"
        />
        <SelectionActionBar className="mb-4" selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
      </AccordionContent>
    </AccordionItem>
  );
}
