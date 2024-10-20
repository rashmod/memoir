import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import videosApi from '@/api/videos';
import handleZipFile from '@/lib/handle-zip-file';
import {
  basicPlaylistColumns,
  basicWatchHistoryColumns,
  detailedWatchHistoryColumns,
  uniqueVideoColumn,
} from '@/videos/columns';

import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import FileUploader from '@/components/custom/file-uploader';
import TableAccordionItem from '@/components/custom/table-accordion-item';

import { BasicPlaylist } from '@/types/table/playlist';
import { BasicVideo, DetailedVideo } from '@/types/table/video';
import { BasicSubscription } from '@/types/table/subscription';

import getUniqueVideos from '@/lib/get-unique-videos';
import { deleteSelectedRows } from '@/lib/delete-selected-rows';

export type uploadedData =
  | {
      key: 'basic';
      history: BasicVideoNew[];
      playlists: BasicPlaylist[];
      subscriptions: BasicSubscription[];
    }
  | {
      key: 'detailed';
      history: DetailedVideoNew[];
      playlists: BasicPlaylist[];
      subscriptions: BasicSubscription[];
    };

export const Route = createFileRoute('/upload')({
  component: Page,
});

function Page() {
  const [jsonData, setJsonData] = useState<uploadedData>({
    key: 'basic',
    history: [],
    playlists: [],
    subscriptions: [],
  });
  const [error, setError] = useState<string>();

  const addMutation = useMutation({
    mutationFn: videosApi.addFile,
    onSuccess: (data) => setJsonData((prev) => ({ ...prev, history: data.data, key: 'detailed' })),
  });

  const uploadMutation = useMutation({
    mutationFn: videosApi.uploadHistory,
  });

  const watchLaterIndex = jsonData.playlists.findIndex((playlist) => playlist.title === 'Watch later');
  const watchLater = watchLaterIndex > -1 ? jsonData.playlists[watchLaterIndex] : undefined;

  const hasData = jsonData.history.length > 0 || jsonData.playlists.length > 0 || jsonData.subscriptions.length > 0;

  const isDetailedData = jsonData.key === 'detailed';

  const uniqueVideos = useMemo(() => getUniqueVideos(jsonData), [jsonData]);

  // TODO deleting in unique videos and playlist takes too long

  console.log(jsonData);

  return (
    <section className="grid place-items-center gap-8">
      {!hasData && (
        <FileUploader
          onUpload={(files) => {
            handleZipFile(files, (data) => {
              setJsonData(data);
              addMutation.mutate(data.history);
            });
          }}
        />
      )}

      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}

      {hasData && (
        <div className="w-full space-y-4">
          <Button onClick={() => uploadMutation.mutate(jsonData.history)} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>

          <Accordion className="grid w-full gap-4" type="multiple" defaultValue={['watch-history']}>
            <TableAccordionItem
              id="unique-videos"
              data={uniqueVideos}
              title="Unique Videos"
              columns={uniqueVideoColumn}
              getRowId={(row) => row.id}
              onDeleteSelectedRows={(selected) =>
                deleteSelectedRows({
                  setData: setJsonData,
                  selected,
                  key: 'unique',
                })
              }
            />

            {isDetailedData ? (
              <TableAccordionItem
                id="watch-history"
                data={jsonData.history}
                title="Watch History"
                columns={detailedWatchHistoryColumns}
                onDeleteSelectedRows={(selected) =>
                  deleteSelectedRows({
                    setData: setJsonData,
                    selected,
                    key: 'history',
                  })
                }
              />
            ) : (
              <TableAccordionItem
                id="watch-history"
                data={jsonData.history}
                title="Watch History"
                columns={basicWatchHistoryColumns}
                onDeleteSelectedRows={(selected) =>
                  deleteSelectedRows({
                    setData: setJsonData,
                    selected,
                    key: 'history',
                  })
                }
              />
            )}

            {watchLater && (
              <TableAccordionItem
                id={`playlist-${watchLater.id}`}
                title={watchLater.title}
                columns={basicPlaylistColumns}
                data={watchLater.videos}
                onDeleteSelectedRows={(selected) =>
                  deleteSelectedRows({
                    setData: setJsonData,
                    selected,
                    key: 'playlists',
                    index: watchLaterIndex,
                  })
                }
              />
            )}

            {jsonData.playlists.map(
              (playlist, i) =>
                i !== watchLaterIndex && (
                  <TableAccordionItem
                    key={playlist.id}
                    id={`playlist-${playlist.id}`}
                    title={playlist.title}
                    columns={basicPlaylistColumns}
                    data={playlist.videos}
                    onDeleteSelectedRows={(selected) =>
                      deleteSelectedRows({
                        setData: setJsonData,
                        selected,
                        key: 'playlists',
                        index: i,
                      })
                    }
                  />
                )
            )}
          </Accordion>
        </div>
      )}
    </section>
  );
}
