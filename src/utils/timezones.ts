import timezonesRaw from "timezones.json";
import { v4 as uuidv4 } from "uuid";
import {
  currentTime,
  getCurrentUserTimezoneName,
  getDifferenceHoursFromHome,
} from "./current-time";
export interface NormalisedTimezone {
  id: string;
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
  const tzs = timezones.flatMap((timezone) =>
    timezone.utc.map((tz) => ({
      id: uuidv4(),
      name: tz,
      offset: timezone.offset,
      isdst: timezone.isdst,
      abbr: timezone.abbr,
      now: currentTime(tz),
      diffHoursFromHome: getDifferenceHoursFromHome(tz),
    }))
  );

  return removeDuplicateTimezones(tzs);
}

export function removeDuplicateTimezones(timezones: NormalisedTimezone[]) {
  return Array.from(new Map(timezones.map((tz) => [tz.name, tz])).values());
}

export function userTimezone() {
  return normalisedTimezones(timezonesRaw).filter((tz) =>
    tz.name.includes(getCurrentUserTimezoneName())
  );
}
