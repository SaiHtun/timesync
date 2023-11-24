import timezonesRaw, { type Timezone } from "timezones.json";
import {
  currentTime,
  getCurrentUserTimezoneName,
  getDifferenceHoursFromHome,
} from "./current-time";
import { SetStateAction, useEffect, useState } from "react";

const MILISECONDS_PER_MIN = 60_000;
export interface NormalisedTimezone {
  name: string;
  offset: number;
  isdst: boolean;
  abbr: string;
  now: string;
  diffHours: number;
}

function normalisedTimezones(timezones: Timezone[]): NormalisedTimezone[] {
  return timezones.flatMap((timezone) =>
    timezone.utc.map((tz) => ({
      name: tz,
      offset: timezone.offset,
      isdst: timezone.isdst,
      abbr: timezone.abbr,
      now: currentTime(tz),
      diffHours: getDifferenceHoursFromHome(tz),
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

type UseTimezonesReturnType = [
  NormalisedTimezone[],
  React.Dispatch<SetStateAction<NormalisedTimezone[]>>
];

export function useTimezones(
  initTimezones = normalisedTimezones(timezonesRaw)
): UseTimezonesReturnType {
  const [timezones, setTimezones] = useState(initTimezones);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;

    const intervalId = setInterval(() => {
      setTimezones((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          now: currentTime(tz.name),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, []);

  return [timezones, setTimezones];
}
