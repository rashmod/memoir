import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import videosApi from '@/api/videos';
import handleZipFile from '@/lib/handle-zip-file';
import { uploadTableColumns } from '@/videos/columns';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/custom/data-table';
import FileUploader from '@/components/custom/file-uploader';
import SelectionActionBar from '@/components/custom/selection-action-bar';

import { Subscription } from '@/types/uploads/subscription';
import { Playlist, PlaylistCatalog } from '@/types/uploads/playlist';
import { BasicVideo, DetailedVideo } from '@/types/video';

export type uploadedData = {
  history: BasicVideo[] | DetailedVideo[];
  playlists: (PlaylistCatalog[number] & { videos: Playlist })[];
  subscriptions: Subscription;
};

export const Route = createFileRoute('/upload')({
  component: Page,
});

// TODO disable selection checkbox when data is being fetched
// TODO handle uploads in multiple parts like multiple files for history
// TODO what should be done for tempdata
// TODO handle large amount of videos

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

  const combinedData = useMemo(() => jsonData.concat(tempData.flat()), [jsonData, tempData]);

  return (
    <section className="grid place-items-center gap-8">
      <FileUploader onUpload={(files) => handleZipFile(files, setJsonData)} />
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {jsonData.history.length > 0 && (
        <div className="w-full space-y-4">
          <Button onClick={() => uploadMutation.mutate(jsonData.history)} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
          <div className="relative grid w-full gap-4">
            <DataTable
              data={jsonData.history}
              columns={uploadTableColumns}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              pagination={pagination}
              setPagination={setPagination}
            />
            <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
          </div>
        </div>
      )}
    </section>
  );
}

// console.log(history.length);
// console.log('with title url');
// console.log(
//   history.find((item) => item.titleUrl),
//   history.filter((item) => item.titleUrl)
// );
// console.log('without title url');
// console.log(
//   history.find((item) => !item.titleUrl),
//   history.filter((item) => !item.titleUrl)
// );
// console.log('with details');
// console.log(
//   history.find((item) => item.details),
//   history.filter((item) => item.details)
// );
// console.log('without details');
// console.log(
//   history.find((item) => !item.details),
//   history.filter((item) => !item.details)
// );
// console.log('with subtitles');
// console.log(
//   history.find((item) => item.subtitles),
//   history.filter((item) => item.subtitles)
// );
// console.log('without subtitles');
// console.log(
//   history.find((item) => !item.subtitles),
//   history.filter((item) => !item.subtitles)
// );
// console.log('without subtitles and details');
// console.log(
//   history.find((item) => !item.subtitles && !item.details),
//   history.filter((item) => !item.subtitles && !item.details)
// );
// console.log('shorts with subtitles field');
// console.log(
//   history.filter((item) => {
//     if (!item.titleUrl) return;
//     const [, id] = item.titleUrl.split('=');
//     return ['g23GHqJje40', '0n0j3D9iP0Q', '3jgRgleRNhs'].find((x) => x === id);
//   })
// );
// console.log('shorts without subtitles field');
// console.log(
//   history.filter((item) => {
//     if (!item.titleUrl) return;
//     const [, id] = item.titleUrl.split('=');
//     return !item.subtitles && !item.details && ['LuVLK2q3N8o', 'hNgEP8Y-oto', 'wd04ZtAvfB4'].find((x) => x === id);
//   })
// );
// console.log('videos without subtitles field');
// console.log(
//   history.filter((item) => {
//     if (!item.titleUrl) return;
//     const [, id] = item.titleUrl.split('=');
//     return !item.subtitles && !item.details && ['SgEbBemhzNE', '6oZhoWb1D9Y', 'm3KTXh5mvTA'].find((x) => x === id);
//   })
// );
