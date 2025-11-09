export function toUnixEpoch(date: Date | string | number): string {
  const d =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date value: ${date}`);
  }

  return Math.floor(d.getTime() / 1000).toString();
}
