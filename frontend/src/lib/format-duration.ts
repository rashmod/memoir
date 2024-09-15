import parseISODuration from './parse-iso-duration';

export default function formatDuration(parsedDuration: ReturnType<typeof parseISODuration>) {
  const day = 24;
  const month = 30 * 24;
  const year = 12 * 30 * 24;

  const years = year * parsedDuration.years;
  const months = month * parsedDuration.months;
  const days = day * parsedDuration.days;
  const hours = parsedDuration.hours;
  const minutes = parsedDuration.minutes;
  const seconds = parsedDuration.seconds;

  const totalHours = hours + days + months + years;

  const paddedHours = String(totalHours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (totalHours > 0) return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  return `${paddedMinutes}:${paddedSeconds}`;
}
