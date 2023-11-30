import timezonesRaw from "timezones.json";
import {
  currentTime,
  getCurrentUserTimezoneName,
  getDifferenceHoursFromHome,
} from "./current-time";
export interface NormalisedTimezone {
  name: string;
  offset: number;
  isdst: boolean;
  abbr: string;
  now: string;
  // if hours > 0 `+${hours}` : string
  diffHoursFromHome: string | number;
}

export function normalisedTimezones(
  timezones = timezonesRaw ?? []
): NormalisedTimezone[] {
  return timezones.flatMap((timezone) =>
    timezone.utc.map((tz) => ({
      name: tz,
      offset: timezone.offset,
      isdst: timezone.isdst,
      abbr: timezone.abbr,
      now: currentTime(tz),
      diffHoursFromHome: getDifferenceHoursFromHome(tz),
    }))
  );
}

export function userTimezone() {
  return normalisedTimezones(timezonesRaw).filter((tz) => {
    const isNameInclude = tz.name.includes(getCurrentUserTimezoneName());

    if (!isSummer() && isNameInclude) {
      return tz.isdst === false;
    } else if (isSummer() && isNameInclude) {
      return tz.isdst === true;
    }
  });
}

function isSummer() {
  return [6, 7, 8].includes(new Date().getMonth());
}
