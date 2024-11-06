import time from '@/constants/time';

const { IN_SECONDS } = time;

export default function formatDuration(duration: number) {
  let dur = duration;


  const hours = Math.floor(dur / IN_SECONDS.hour);
  dur = dur % IN_SECONDS.hour;

  const minutes = Math.floor(dur / IN_SECONDS.minute);
  dur = dur % IN_SECONDS.minute;

  const seconds = dur;


  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  return `${paddedMinutes}:${paddedSeconds}`;
}
