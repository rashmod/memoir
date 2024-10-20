import JSZip from 'jszip';

import processFile from '@/lib/process-file';
import processPlaylist from '@/lib/process-playlist';
import { uploadedData } from '@/routes/upload';

export default function handleZipFile(acceptedFiles: File[], setData: (data: uploadedData) => void) {
  const [zipFile] = acceptedFiles;

  if (!zipFile) return;

  const zip = new JSZip();
  const reader = new FileReader();

  reader.onload = async (event: ProgressEvent<FileReader>) => {
    const result = await loadZipFiles(event, zip);
    if (!result) return;

    const [watchHistory] = result.filter((item) => item.folder === 'history');
    const [subscriptions] = result.filter((item) => item.folder === 'subscriptions');
    const playlists = processPlaylist(result);

    setData({
      key: 'basic',
      playlists,
      history: watchHistory!.data,
      subscriptions: subscriptions!.data,
    });
  };

  reader.readAsArrayBuffer(zipFile);
}

async function loadZipFiles(event: ProgressEvent<FileReader>, zip: JSZip) {
  if (!event.target) return;
  if (!event.target.result) return;

  await zip.loadAsync(event.target.result);

  const filePromises = Object.values(zip.files).map(processFile);
  const result = await Promise.all(filePromises).then((files) => files.filter((item) => !!item));

  return result;
}
