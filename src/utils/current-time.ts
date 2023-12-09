import { format } from "date-fns";
import {
  NormalisedTimezone,
  TimezoneFormatType,
} from "~/utils/hooks/use-timezones";

export function currentTime(
  timezoneName = getCurrentUserTimezoneName(),
  formatOptions: Intl.DateTimeFormatOptions = {}
) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: timezoneName,
    day: "numeric",
    weekday: "short",
    month: "short",
    year: "numeric",
    hourCycle: "h23",
  };

  return new Intl.DateTimeFormat(
    "en-En",
    Object.assign(options, formatOptions)
  ).format(new Date());
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatTimezone(
  now: string,
  timezoneFormat: TimezoneFormatType = "h23",
  clockFormat = "k:mm a",
  dayOfWeekFormat = "eee",
  monthFormat = "LLL",
  dayOfMonthFormat = "d"
) {
  const currentTime = new Date(now);
  clockFormat = timezoneFormat === "h23" ? "k:mm a" : "h:mm a";
  return {
    clock: format(currentTime, clockFormat),
    dayOfWeek: format(currentTime, dayOfWeekFormat),
    month: format(currentTime, monthFormat),
    dayOfMonth: format(currentTime, dayOfMonthFormat),
  };
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
