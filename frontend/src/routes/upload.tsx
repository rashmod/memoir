import { createFileRoute } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import FileUploader from '@/components/custom/file-uploader';
import filterJsonData from '@/lib/filterJsonData';
import Table from '@/videos/table';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const [openEditDialog, setOpenEditDialog] = useState(false);

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
          {Object.keys(rowSelection).length > 0 && (
            <div className="sticky bottom-5 z-50 justify-self-center rounded-md border bg-muted/95 px-4 py-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-muted/30">
              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm">
                    <Edit className="mr-2 size-4" /> Edit Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add tags to videos</DialogTitle>
                    <DialogDescription>
                      This will add tags to the selected videos. You can choose to keep previous tags.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="grid gap-4">
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="tag" className="pr-5">
                          Tags
                        </Label>
                        <Input id="tags" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setOpenEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" size="sm">
                    <Trash className="mr-2 size-4" /> Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete these videos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {Object.keys(rowSelection).length}{' '}
                      video entries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={onDeleteSelected}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
