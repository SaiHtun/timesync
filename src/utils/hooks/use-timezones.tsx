import { SetStateAction, useState, Dispatch } from "react";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { arrayRange } from "..";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

// const start24Hours = parseInt(format(new Date(timezone.now), FORMAT_STR_24));
// const hours24 = arrayRange(start24Hours, start24Hours + 23);

export function getTimeDials(clock: string, offset: number): Array<number> {
  // const formatStr = timezoneFormat === "h23" ? "k" : "h";
  let timezoneFormat = "h23";
  const startHours = parseInt(clock.split(" ")[0].split(":")[0]);

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

  return diffHours >= 0 ? `+${diffHours}` : `${diffHours}`;
}

const formatStr = "eee, MMM d, y, k:mm a, zzz, zzzz";
export interface Timezone {
  name: string;
  value: string;
  abbr: string;
  now: string;
  dayOfWeek: string;
  monthAndDay: string;
  year: string;
  clock: string;
  offset: number;
  diffHoursFromHome: string;
  timeDials: number[];
}

function getSupportedTimezonesName(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

function populateTimezones(): Timezone[] {
  const date = new Date();

  return getSupportedTimezonesName().map((name) => {
    const now = formatInTimeZone(date, name, formatStr);
    const [dayOfWeek, monthAndDay, year, clock, abbr, value] = now.split(", ");
    const offset = getTimezoneOffset(name, date) / (60 * 60 * 1_000);

    return {
      name,
      value,
      abbr,
      now,
      dayOfWeek,
      monthAndDay,
      year,
      clock,
      offset,
      diffHoursFromHome: "",
      timeDials: [],
    };
  });
}

type UseTimezonesReturnType = [
  Timezone[],
  Dispatch<SetStateAction<Timezone[]>>
];

export type TimezoneFormatType = "h12" | "h23";

// const MILISECONDS_PER_MIN = 60_000;

export function useTimezones(
  defaultTimezones?: Timezone[]
): UseTimezonesReturnType {
  function initTimezones() {
    return defaultTimezones || populateTimezones();
  }

  const [timezones, setTimezones] = useState(initTimezones);

  // useEffect(() => {
  //   setTimezones((preTimezones) => {
  //     return preTimezones.map((preTz) => {
  //       const now = currentTime(preTz.name, { hourCycle: timezoneFormat });
  //       return {
  //         ...preTz,
  //         now,
  //         timeDials: getTimeDials(now, timezoneFormat, preTz.offset),
  //       };
  //     });
  //   });
  // }, [timezoneFormat]);

  // useEffect(() => {
  //   const requiredIntervalToBeAMinute =
  //     MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;
  //   const intervalId = setInterval(() => {
  //     setTimezones((tzs) =>
  //       tzs.map((tz) => ({
  //         ...tz,
  //         now: currentTime(tz.name),
  //       }))
  //     );
  //   }, requiredIntervalToBeAMinute);

  //   return () => clearInterval(intervalId);
  // }, [timezones]);

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
