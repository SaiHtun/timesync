import { differenceInHours } from "date-fns";

export function currentTime(
  formatOptions,
  isDateConvertable = false,
  timezoneName = getCurrentUserTimezoneName()
) {
  const optionsRequiredToConvertToDate = isDateConvertable
    ? {
        day: "numeric",
        year: "numeric",
        second: "numeric",
      }
    : {};

  const options = Object.assign(
    {
      hour: "numeric",
      minute: "numeric",
      timeZone: timezoneName,
    },
    optionsRequiredToConvertToDate
  );

  return new Intl.DateTimeFormat(
    "en-En",
    Object.assign(options, formatOptions)
  ).format(new Date());
}
export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const str = "America/Kentucky/Monticello";

const r = "Asia/Rangoon";
const c = "America/Los_Angeles";

export function getDifferenceHoursFromHome(otherTimezoneName) {
  const homeTimezone = currentTime(undefined, true);
  const otherTimezone = currentTime(undefined, true, otherTimezoneName);

  console.log(homeTimezone);
  console.log(otherTimezone);

  const diffHours = differenceInHours(
    new Date(otherTimezone),
    new Date(homeTimezone)
  );

  return diffHours;
}

const res = getDifferenceHoursFromHome(r);
console.log(res);
