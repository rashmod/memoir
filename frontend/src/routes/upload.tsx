import { createFileRoute } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import FileUploader from '@/components/custom/file-uploader';
import SelectionActionBar from '@/components/custom/selection-action-bar';
import filterJsonData from '@/lib/filterJsonData';
import Table from '@/videos/table';

import { Checkbox } from '@/components/ui/checkbox';

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
  id: z.string(),
  title: z.string(),
  url: z.string(),
  time: z.string().datetime(),
  channelTitle: z.string().optional(),
  channelUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  duration: z.string().duration().optional(),
});

const videosSchema = z.array(videoSchema);

export type JsonSchema = z.infer<typeof jsonSchema>;
export type VideoSchema = z.infer<typeof videoSchema>;
export type VideosSchema = z.infer<typeof videosSchema>;

function Page() {
  const [jsonData, setJsonData] = useState<VideosSchema>();
  const [error, setError] = useState<string>();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  console.log(jsonData);

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
              setJsonData((prev) => (prev ? prev.concat(formattedData) : formattedData));
              setError(undefined);
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
    setJsonData((prev) => {
      return prev?.filter((item) => !rowSelection[item.id]).filter(Boolean);
    });
    setRowSelection({});
  }

  return (
    <section className="grid place-items-center gap-8">
      <FileUploader onUpload={onUpload} />
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {jsonData && (
        <div className="relative grid w-full gap-4">
          <Table videos={jsonData} rowSelection={rowSelection} setRowSelection={setRowSelection} />
          <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
        </div>
      )}
    </section>
  );
}
