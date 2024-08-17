export const extractNumber = (str: string): number => {
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : NaN;
};

export const dateToTimestamp = (dateStr: string): number => {
  const [day, month, year] = dateStr.split("/").map(Number);
  const date = new Date(year ?? 0, (month ?? 0) - 1, day);
  return date.getTime();
};
