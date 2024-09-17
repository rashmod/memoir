import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import FileUploader from '@/components/custom/file-uploader';
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

const videoSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
    time: z.string().datetime(),
    channelTitle: z.string().optional(),
    channelUrl: z.string().optional(),
    thumbnail: z.string().optional(),
    duration: z.string().duration().optional(),
  })
);

type JsonSchema = z.infer<typeof jsonSchema>;
export type VideoSchema = z.infer<typeof videoSchema>;

function Page() {
  const [jsonData, setJsonData] = useState<VideoSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              const formattedData: VideoSchema = result.data
                .filter((item) => !item.details)
                .filter((item) => item.titleUrl)
                .map((item) => {
                  const subtitles = item.subtitles;

                  const channelTitle = subtitles ? subtitles[0].name : undefined;
                  const channelUrl = subtitles ? subtitles[0].url : undefined;
                  const title = item.title.replace('Watched ', '');
                  const url = item.titleUrl!;
                  const [, id] = url.split('=');
                  const time = item.time;

                  return { title, channelTitle, channelUrl, url, id, time };
                });

              setJsonData((prev) => (prev ? prev.concat(formattedData) : formattedData));
              setError(null);
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

  return (
    <section className="grid place-items-center">
      <FileUploader onUpload={onUpload} />
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {jsonData && <Table videos={jsonData} />}
    </section>
  );
}
