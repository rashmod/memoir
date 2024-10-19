import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';

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
import { cn } from '@/lib/utils';

export default function SelectionActionBar({
  selectedCount,
  onDeleteSelected,
  className,
}: {
  selectedCount: number;
  onDeleteSelected: () => void;
  className?: string;
}) {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    selectedCount > 0 && (
      <div
        className={cn(
          'sticky bottom-5 z-50 justify-self-center rounded-md border bg-muted/95 px-4 py-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-muted/30',
          className
        )}
      >
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
                This action cannot be undone. This will permanently delete {selectedCount} video entries.
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
    )
  );
}
