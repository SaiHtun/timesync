export function currentTime(
  timezoneName = getCurrentUserTimezoneName(),
  formatOptions: Intl.DateTimeFormatOptions = {}
) {
  const options: Intl.DateTimeFormatOptions = Object.assign(
    {
      hour: "numeric",
      minute: "numeric",
      timeZone: timezoneName,
    },
    formatOptions
  );

  return new Intl.DateTimeFormat("en-En", options).format(new Date());
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getDifferenceHoursFromHome(otherTimezoneName: string) {
  const homeTimezone = new Date().toLocaleString("en-US");
  const otherTimezone = new Date().toLocaleString("en-US", {
    timeZone: otherTimezoneName,
  });

  const parsedHome = new Date(homeTimezone) as any;
  const parsedOther = new Date(otherTimezone) as any;

  return (parsedOther - parsedHome) / (60 * 60 * 1000);
}
