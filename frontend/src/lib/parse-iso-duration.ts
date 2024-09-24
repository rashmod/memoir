import time from '@/constants/time';

const { IN_SECONDS } = time;

export default function parseISODuration(isoDuration: string) {
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const matches = isoDuration.match(regex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const [, years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0] = matches.map((item) =>
    isNaN(Number(item)) ? 0 : Number(item)
  );

  const duration =
    seconds +
    minutes * IN_SECONDS.minute +
    hours * IN_SECONDS.hour +
    days * IN_SECONDS.day +
    months * IN_SECONDS.month +
    years * IN_SECONDS.year;

  return duration;
}
