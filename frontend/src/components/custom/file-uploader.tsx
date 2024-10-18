import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function FileUploader({ onUpload }: { onUpload: (acceptedFiles: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    accept: {
      'application/zip': ['.zip'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        {
          'border-muted-foreground/50': isDragActive,
        }
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
        <div className="rounded-full border border-dashed p-3">
          <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="font-medium text-muted-foreground">Drop the files here</p>
        {isDragActive ? (
          <p className="font-medium text-muted-foreground">Drop the files here</p>
        ) : (
          <div className="flex flex-col gap-px">
            <p className="font-medium text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </div>
    </div>
  );
}
