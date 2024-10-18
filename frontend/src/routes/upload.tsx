import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import videosApi from '@/api/videos';
import handleZipFile from '@/lib/handle-zip-file';
import { basicWatchHistoryColumns, detailedWatchHistoryColumns } from '@/videos/columns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { DataTable } from '@/components/custom/data-table';
import FileUploader from '@/components/custom/file-uploader';
import SelectionActionBar from '@/components/custom/selection-action-bar';

import { BasicPlaylist } from '@/types/table/playlist';
import { BasicVideo, DetailedVideo } from '@/types/table/video';
import { BasicSubscription } from '@/types/table/subscription';

export type uploadedData = {
  history: BasicVideo[] | DetailedVideo[];
  playlists: BasicPlaylist[];
  subscriptions: BasicSubscription[];
};

export const Route = createFileRoute('/upload')({
  component: Page,
});

function Page() {
  const [jsonData, setJsonData] = useState<uploadedData>({ history: [], playlists: [], subscriptions: [] });
  const [error, setError] = useState<string>();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  const addMutation = useMutation({
    mutationFn: videosApi.addFile,
    onSuccess: (data) => setJsonData((prev) => ({ ...prev, history: data.data })),
  });

  const uploadMutation = useMutation({
    mutationFn: videosApi.uploadHistory,
  });

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  function onDeleteSelected() {
    setJsonData((prev) => ({ ...prev, history: prev.history.filter((_, index) => !rowSelection[index]) }));
    setRowSelection({});
  }

  console.log(jsonData);

  return (
    <section className="grid place-items-center gap-8">
      <FileUploader
        onUpload={(files) => {
          handleZipFile(files, (data) => {
            setJsonData(data);
            addMutation.mutate(data.history);
          });
        }}
      />
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {jsonData.history.length > 0 && (
        <div className="w-full space-y-4">
          <Button onClick={() => uploadMutation.mutate(jsonData.history)} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
          <Accordion className="relative grid w-full gap-4" type="multiple">
            <AccordionItem value="watch-history" className="border-0">
              <AccordionTrigger className="group rounded-md bg-muted-foreground px-4 py-2 text-sm font-normal text-white hover:no-underline data-[state=open]:rounded-b-none">
                <p className="group-hover:underline">Watch History</p>
                <Badge className="-mb-0.5 font-medium hover:no-underline">{jsonData.history.length}</Badge>
              </AccordionTrigger>
              <AccordionContent>
                <DataTable
                  data={jsonData.history}
                  columns={addMutation.isSuccess ? detailedWatchHistoryColumns : basicWatchHistoryColumns}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  pagination={pagination}
                  setPagination={setPagination}
                />
                <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </section>
  );
}
