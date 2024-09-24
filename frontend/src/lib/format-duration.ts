import time from '@/constants/time';

const { IN_SECONDS } = time;

export default function formatDuration(duration: number) {
  let dur = duration;

  const years = Math.floor(dur / IN_SECONDS.year);
  dur = dur % IN_SECONDS.year;

  const months = Math.floor(dur / IN_SECONDS.month);
  dur = dur % IN_SECONDS.month;

  const days = Math.floor(dur / IN_SECONDS.day);
  dur = dur % IN_SECONDS.day;

  const hours = Math.floor(dur / IN_SECONDS.hour);
  dur = dur % IN_SECONDS.hour;

  const minutes = Math.floor(dur / IN_SECONDS.minute);
  dur = dur % IN_SECONDS.minute;

  const seconds = dur;

  const totalHours = hours + days + months + years;

  const paddedHours = String(totalHours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (totalHours > 0) return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  return `${paddedMinutes}:${paddedSeconds}`;
}
