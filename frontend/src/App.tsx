import VideoTable from './videos/table';

/*
 *
 * what i know
 * ads will have details field
 * some entries may not have subtitles field
 * entries without subtitles field may be removed or made private
 * shorts may not have subtitles field
 * surveys will not have titleUrl field
 *
 * removed or private videos are not part of the youtube api response
 *
 * watch history cleaning steps
 * remove items without details
 * fetch video details from google api
 * if response does not include the request id then video is removed
 *
 * i want to show video thumbnail, title, channel name, channel photo ??, watch date, where it was watched (youtube / youtube music)
 *
 */

export default function App() {
  return (
    <div className="grid min-h-[100dvh] grid-rows-[auto_1fr]">
      <div className="container mx-auto px-8">
        <VideoTable />
      </div>
    </div>
  );
}
