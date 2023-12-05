import { NormalisedTimezone } from "./timezones";

export function currentTime(
  timezoneName = getCurrentUserTimezoneName(),
  formatOptions: Intl.DateTimeFormatOptions = {}
) {
  const options: Intl.DateTimeFormatOptions = Object.assign(
    {
      hour: "numeric",
      minute: "numeric",
      timeZone: timezoneName,
      day: "numeric",
      weekday: "short",
      month: "short",
    },
    formatOptions
  );

  return new Intl.DateTimeFormat("en-En", options).format(new Date());
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getDifferenceHoursFromHome(
  otherTimezoneName: string,
  homeTimezoneName = getCurrentUserTimezoneName()
) {
  const homeTimezone = new Date().toLocaleString("en-US", {
    timeZone: homeTimezoneName,
  });
  const otherTimezone = new Date().toLocaleString("en-US", {
    timeZone: otherTimezoneName,
  });

  const parsedHome = new Date(homeTimezone) as any;
  const parsedOther = new Date(otherTimezone) as any;

  const diffHours = (parsedOther - parsedHome) / (60 * 60 * 1000);

  return diffHours >= 0 ? `+${diffHours}` : diffHours;
}

export function calcTime(timezone: NormalisedTimezone) {
  const date = new Date();

  const utc = date.getTime() + date.getTimezoneOffset() * 60000;

  return new Date(utc + 3600000 * timezone.offset);
}
