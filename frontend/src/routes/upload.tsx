import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import videosApi from '@/api/videos';
import filterJsonData from '@/lib/filter-json-data';

import FileUploader from '@/components/custom/file-uploader';
import SelectionActionBar from '@/components/custom/selection-action-bar';
import { Button } from '@/components/ui/button';
import Table from '@/videos/table';

export const Route = createFileRoute('/upload')({
  component: Page,
});

const jsonSchema = z.array(
  z.object({
    title: z.string(),
    titleUrl: z.string().optional(),
    time: z.string().datetime(),
    subtitles: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    details: z.any().optional(),
  })
);

const videoSchema = z.object({
  youtubeId: z.string(),
  title: z.string(),
  url: z.string(),
  time: z.string().datetime(),
  thumbnailUrl: z.string().optional(),
  duration: z.number().optional(),
  youtubeCreatedAt: z.date().optional(),
  channelId: z.string().optional(),
  channelName: z.string().optional(),
  channelUrl: z.string().optional(),
  channelAvatarUrl: z.string().optional(),
});

const videosSchema = z.array(videoSchema);

export type JsonSchema = z.infer<typeof jsonSchema>;
export type VideoSchema = z.infer<typeof videoSchema>;
export type VideosSchema = z.infer<typeof videosSchema>;

// TODO disable selection checkbox when data is being fetched
// TODO handle uploads in multiple parts like multiple files for history
// TODO what should be done for tempdata
// TODO handle large amount of videos

function Page() {
  const [jsonData, setJsonData] = useState<VideosSchema>([]);
  const [tempData, setTempData] = useState<VideosSchema[]>([]);
  const [error, setError] = useState<string>();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const addMutation = useMutation({
    mutationFn: videosApi.addFile,
    onSuccess: (data) => {
      setJsonData((prev) => prev.concat(data.data));
      setTempData((prev) => {
        prev.shift();
        return prev;
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: videosApi.uploadHistory,
  });

  function onUpload(acceptedFiles: File[]) {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          if (event.target?.result) {
            const parsedJson = JSON.parse(event.target.result as string);
            const result = jsonSchema.safeParse(parsedJson);

            if (result.success) {
              const formattedData: VideosSchema = filterJsonData(result.data);
              setTempData((prev) => prev.concat([formattedData]));
              setError(undefined);
              addMutation.mutate(formattedData);
            } else {
              setError('Invalid json structure');
              console.error(result.error);
            }
          }
        } catch (error) {
          setError('Invalid json file');
          console.error('Error parsing JSON file:', error);
        }
      };

      reader.readAsText(file);
    });
  }

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  function onDeleteSelected() {
    setJsonData((prev) => prev.filter((_, index) => !rowSelection[index]));
    setRowSelection({});
  }

  const combinedData = useMemo(() => jsonData.concat(tempData.flat()), [jsonData, tempData]);

  return (
    <section className="grid place-items-center gap-8">
      <FileUploader onUpload={onUpload} />
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {(jsonData.length > 0 || tempData.length > 0) && (
        <div className="space-y-4">
          <Button onClick={() => uploadMutation.mutate(jsonData)}>Upload</Button>
          <div className="relative grid w-full gap-4">
            <Table
              jsonData={combinedData}
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
