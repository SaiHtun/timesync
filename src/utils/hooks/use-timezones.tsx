import { SetStateAction, useState, useEffect, Dispatch } from "react";
import timezonesRaw from "timezones.json";
import { v4 as uuidv4 } from "uuid";
import {
  currentTime,
  getCurrentUserTimezoneName,
  getDifferenceHoursFromHome,
} from "~/utils/current-time";
import { arrayRange } from "..";
import { format } from "date-fns";

export interface NormalisedTimezone {
  id: string;
  name: string;
  offset: number;
  isdst: boolean;
  abbr: string;
  now: string;
  timeDials: number[];
  // if hours > 0 `+${hours}` : string
  diffHoursFromHome: string | number;
}

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

// const start24Hours = parseInt(format(new Date(timezone.now), FORMAT_STR_24));
// const hours24 = arrayRange(start24Hours, start24Hours + 23);

function getTimeDials(
  now: string,
  timezoneFormat: TimezoneFormatType,
  offset: number
): Array<number> {
  const formatStr = timezoneFormat === "h23" ? "k" : "h";
  const startHours = parseInt(format(new Date(now), formatStr));
  return arrayRange(startHours, startHours + 23).map((hour) => {
    let h = hour;

    if (isDecimal(offset)) {
      h += 0.5;
    }
    return timezoneFormat === "h23"
      ? h % 24 || 24
      : h % 12 === 0.5
      ? 12.5
      : h % 12 || 12;
  });
}

export function normalisedTimezones(
  timezoneFormat: TimezoneFormatType = "h23",
  timezones = timezonesRaw ?? []
): NormalisedTimezone[] {
  const tzs = timezones.flatMap((timezone) =>
    timezone.utc.map((tz) => {
      const now = currentTime(tz, { hourCycle: timezoneFormat });
      return {
        id: uuidv4(),
        name: tz,
        offset: timezone.offset,
        isdst: timezone.isdst,
        abbr: timezone.abbr,
        now,
        timeDials: getTimeDials(now, timezoneFormat, timezone.offset),
        diffHoursFromHome: getDifferenceHoursFromHome(tz),
      };
    })
  );

  return removeDuplicateTimezones(tzs);
}

export function removeDuplicateTimezones(timezones: NormalisedTimezone[]) {
  return Array.from(new Map(timezones.map((tz) => [tz.name, tz])).values());
}

export function userTimezone(timezoneFormat: TimezoneFormatType) {
  return normalisedTimezones(timezoneFormat, timezonesRaw).filter((tz) =>
    tz.name.includes(getCurrentUserTimezoneName())
  );
}

type UseTimezonesReturnType = [
  NormalisedTimezone[],
  Dispatch<SetStateAction<NormalisedTimezone[]>>
];

export type TimezoneFormatType = "h12" | "h23";

const MILISECONDS_PER_MIN = 60_000;

export function useTimezones(
  timezoneFormat: TimezoneFormatType = "h23",
  defaultTimezones?: NormalisedTimezone[]
): UseTimezonesReturnType {
  function initTimezones() {
    return defaultTimezones || normalisedTimezones(timezoneFormat);
  }

  const [timezones, setTimezones] = useState(initTimezones);

  useEffect(() => {
    setTimezones((preTimezones) => {
      return preTimezones.map((preTz) => {
        const now = currentTime(preTz.name, { hourCycle: timezoneFormat });
        return {
          ...preTz,
          now,
          timeDials: getTimeDials(now, timezoneFormat, preTz.offset),
        };
      });
    });
  }, [timezoneFormat]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;

    const intervalId = setInterval(() => {
      setTimezones((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          now: currentTime(tz.name, { hourCycle: timezoneFormat }),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, [timezones]);

  return [timezones, setTimezones];
}

type UseTimezoneFormatReturnType = [TimezoneFormatType, () => void];

export function useTimezoneFormat(
  defaultValue = "h23" as const
): UseTimezoneFormatReturnType {
  const [timezoneFormat, setTimezoneFormat] = useState<"h23" | "h12">(
    defaultValue
  );

  function toggleTimezoneFormat() {
    setTimezoneFormat((preValue) => (preValue === "h23" ? "h12" : "h23"));
  }

  return [timezoneFormat, toggleTimezoneFormat];
}
