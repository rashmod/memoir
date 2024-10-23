import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { uploadData, addFile } from '@/api/upload';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

  const [showExisting, setShowExisting] = useState(false);

  const navigate = useNavigate();

  const addMutation = useMutation({
    mutationFn: addFile,
    onSuccess: ({ data }) =>
      setJsonData((prev) => ({ ...prev, history: data.history, playlists: data.playlists, key: 'detailed' })),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadData,
    onSuccess: () => navigate({ to: '/' }),
  });

  const hasData = jsonData.history.length > 0 || jsonData.playlists.length > 0 || jsonData.subscriptions.length > 0;

  const filteredData = useMemo(() => {
    if (jsonData.key === 'basic' || showExisting) return jsonData;
    return {
      key: jsonData.key,
      history: jsonData.history.filter((video) => video.new),
      playlists: jsonData.playlists.map((playlist) => ({
        ...playlist,
        videos: playlist.videos.filter((video) => video.new),
      })),
      subscriptions: jsonData.subscriptions,
    };
  }, [showExisting, jsonData]);

  const watchLaterIndex = filteredData.playlists.findIndex((playlist) => playlist.title === 'Watch later');
  const watchLater = watchLaterIndex > -1 && filteredData.playlists[watchLaterIndex]!;

  const uniqueVideos = useMemo(() => {
    if (jsonData.key === 'basic') return getUniqueVideos(jsonData);
    return getUniqueVideos(filteredData);
  }, [jsonData, filteredData]);

  const isDetailedData = filteredData.key === 'detailed';

  function onUpload() {
    if (!isDetailedData) return;
    if (showExisting) {
      uploadMutation.mutate({
        history: filteredData.history.filter((video) => video.new),
        playlists: filteredData.playlists.map((playlist) => ({
          ...playlist,
          videos: playlist.videos.filter((video) => video.new),
        })),
      });
      return;
    }
    uploadMutation.mutate(filteredData);
  }

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
          <div className="flex items-end justify-between">
            <Button onClick={onUpload} disabled={!isDetailedData || uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
            <div className="flex items-center gap-2">
              <Switch id="toggle-existing" checked={showExisting} onCheckedChange={setShowExisting} />
              <Label htmlFor="toggle-existing">{showExisting ? 'Hide' : 'Show'} existing data</Label>
            </div>
          </div>

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
                  data={filteredData.history}
                  title="Watch History"
                  columns={detailedWatchHistoryColumns}
                  onDeleteSelectedRows={(selected) =>
                    deleteSelectedRows({
                      setData: setJsonData,
                      selected,
                      key: 'history',
                    })
                  }
                  getRowClassName={(row) => {
                    const className: string[] = [];

                    if (showExisting) {
                      if (row.new) {
                        className.push('bg-green-50');
                      } else {
                        className.push('opacity-40');
                      }
                    }

                    return className.join(' ');
                  }}
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
                    getRowClassName={(row) => {
                      const className: string[] = [];

                      if (showExisting) {
                        if (row.new) {
                          className.push('bg-green-50');
                        } else {
                          className.push('opacity-40');
                        }
                      }

                      return className.join(' ');
                    }}
                  />
                )}

                {filteredData.playlists.map(
                  (playlist, i) =>
                    i !== watchLaterIndex && (
                      <TableAccordionItem
                        key={playlist.id}
                        id={`playlist-${playlist.id}`}
                        getRowClassName={(row) => {
                          const className: string[] = [];

                          if (showExisting) {
                            if (row.new) {
                              className.push('bg-green-50');
                            } else {
                              className.push('opacity-40');
                            }
                          }

                          return className.join(' ');
                        }}
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
                  data={filteredData.history}
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

                {filteredData.playlists.map(
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
