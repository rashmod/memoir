import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import videosApi from '@/api/videos';
import handleZipFile from '@/lib/handle-zip-file';
import getUniqueVideos, { DetailedUniqueVideo } from '@/lib/get-unique-videos';
import { deleteSelectedRows } from '@/lib/delete-selected-rows';

import { basicUniqueVideoColumns, detailedUniqueVideoColumns } from '@/columns/unique-videos';
import { basicPlaylistColumns, detailedPlaylistColumns } from '@/columns/playlist';
import { basicWatchHistoryColumns, detailedWatchHistoryColumns } from '@/columns/watch-history';

import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import FileUploader from '@/components/custom/file-uploader';
import TableAccordionItem from '@/components/custom/table-accordion-item';

import { BasicPlaylist, DetailedPlaylist, DetailedPlaylistVideo } from '@/types/table/playlist';
import { BasicVideo, DetailedVideo } from '@/types/table/video';
import { BasicSubscription } from '@/types/table/subscription';

export type uploadedData =
  | {
      key: 'basic';
      history: BasicVideo[];
      playlists: BasicPlaylist[];
      subscriptions: BasicSubscription[];
    }
  | {
      key: 'detailed';
      history: DetailedVideo[];
      playlists: DetailedPlaylist[];
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
    onSuccess: ({ data }) =>
      setJsonData((prev) => ({ ...prev, history: data.history, playlists: data.playlists, key: 'detailed' })),
  });

  const uploadMutation = useMutation({
    mutationFn: videosApi.uploadData,
  });

  const watchLaterIndex = jsonData.playlists.findIndex((playlist) => playlist.title === 'Watch later');
  const watchLater = watchLaterIndex > -1 && jsonData.playlists[watchLaterIndex]!;

  const hasData = jsonData.history.length > 0 || jsonData.playlists.length > 0 || jsonData.subscriptions.length > 0;

  const uniqueVideos = useMemo(() => getUniqueVideos(jsonData), [jsonData]);

  const isDetailedData = jsonData.key === 'detailed';

  // TODO deleting in unique videos and playlist takes too long
  // TODO show new videos added to a playlist
  // TODO show videos removed from a playlist
  // TODO show new playlist
  // TODO show removed playlist

  return (
    <section className="grid place-items-center gap-8">
      {!hasData && (
        <FileUploader
          onUpload={(files) => {
            handleZipFile(files, (data) => {
              setJsonData(data);
              addMutation.mutate({ history: data.history, playlists: data.playlists });
            });
          }}
        />
      )}

      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}

      {hasData && (
        <div className="mb-auto w-full space-y-4">
          <Button
            onClick={() => uploadMutation.mutate(jsonData)}
            disabled={!isDetailedData || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>

          <Accordion className="grid w-full gap-4" type="multiple" defaultValue={['watch-history']}>
            {isDetailedData ? (
              <>
                <TableAccordionItem
                  id="unique-videos"
                  data={uniqueVideos as DetailedUniqueVideo[]}
                  title="Unique Videos"
                  columns={detailedUniqueVideoColumns}
                  getRowId={(row) => row.videoId}
                  onDeleteSelectedRows={(selected) =>
                    deleteSelectedRows({
                      setData: setJsonData,
                      selected,
                      key: 'unique',
                    })
                  }
                />
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

                {watchLater && (
                  <TableAccordionItem
                    id={`playlist-${watchLater.id}`}
                    title={watchLater.title}
                    columns={detailedPlaylistColumns}
                    data={watchLater.videos as DetailedPlaylistVideo[]}
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
                        columns={detailedPlaylistColumns}
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
              </>
            ) : (
              <>
                <TableAccordionItem
                  id="unique-videos"
                  data={uniqueVideos}
                  title="Unique Videos"
                  columns={basicUniqueVideoColumns}
                  getRowId={(row) => row.videoId}
                  onDeleteSelectedRows={(selected) =>
                    deleteSelectedRows({
                      setData: setJsonData,
                      selected,
                      key: 'unique',
                    })
                  }
                />
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
              </>
            )}
          </Accordion>
        </div>
      )}
    </section>
  );
}
