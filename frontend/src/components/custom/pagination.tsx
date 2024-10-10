import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import DebouncedInput from '@/components/custom/debounced-input';

export default function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex items-center justify-between bg-muted/70 px-4 py-2">
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          First
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          Last
        </Button>
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span>Page</span>
          <span className="font-bold">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Button>

        <span className="text-nowrap">Go to page:</span>
        <DebouncedInput
          type="number"
          className="h-9"
          min={1}
          max={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          handleChange={(value) => {
            const page = value ? Number(value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </div>
    </div>
  );
}
