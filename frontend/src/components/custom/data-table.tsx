import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/custom/pagination';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection?: {
    state: RowSelectionState;
    setState: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  };
  pagination?: {
    state: PaginationState;
    setState: React.Dispatch<React.SetStateAction<PaginationState>>;
  };
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  tableClassName?: string;
  tableContainerClassName?: string;
  getRowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  pagination,
  onRowClick,
  getRowId,
  tableClassName,
  tableContainerClassName,
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const tableConfig: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {},
  };

  if (getRowId) {
    tableConfig.getRowId = getRowId;
  }

  if (rowSelection) {
    tableConfig.onRowSelectionChange = rowSelection.setState;
    tableConfig.state!.rowSelection = rowSelection.state;
  }

  if (pagination) {
    tableConfig.getPaginationRowModel = getPaginationRowModel();
    tableConfig.onPaginationChange = pagination.setState;
    tableConfig.state!.pagination = pagination.state;
  }

  const table = useReactTable(tableConfig);

  return (
    <div className={cn('rounded-md border', tableContainerClassName)}>
      {pagination && <Pagination table={table} />}
      <Table className={cn('border-b border-t bg-card', tableClassName)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => onRowClick?.(row.original)}
                className={cn(getRowClassName && getRowClassName(row.original))}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && <Pagination table={table} />}
    </div>
  );
}
