export type FormatCbParamsType = {
  hours: number;
  minutes: number;
};

export function convertMinutesToHoursMinutesFormat(
  minutes: number,
  cb?: (params: FormatCbParamsType) => string
): string | FormatCbParamsType {
  const hoursMinutes = {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };

  if (cb) {
    return cb(hoursMinutes);
  }

  return hoursMinutes;
}
