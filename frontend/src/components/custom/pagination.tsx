import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import DebouncedInput from '@/components/custom/debounced-input';

export default function Pagination<TData>({ table }: { table: Table<TData> }) {
  const totalRows = table.getRowCount();
  const currentIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();

  const currentRows = Math.min((currentIndex + 1) * pageSize, totalRows);
  const startRow = Math.min(currentIndex * pageSize + 1, totalRows);
  const currentPage = Math.min(currentIndex + 1, totalPages);

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
      <div className="flex items-center space-x-2">
        <span>Showing</span>
        <span className="font-bold">
          {startRow} - {currentRows} of {totalRows}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span>Page</span>
        <span className="font-bold">
          {currentPage} of {totalPages.toLocaleString()}
        </span>
      </div>
      <Button variant="outline" size="sm" asChild>
        <select
          value={pageSize}
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
      <div className="flex items-center space-x-2">
        <span className="text-nowrap">Go to page:</span>
        <DebouncedInput
          type="number"
          className="h-9"
          min={1}
          max={totalPages}
          value={currentPage}
          handleChange={(value) => {
            const page = value ? Number(value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </div>
    </div>
  );
}
