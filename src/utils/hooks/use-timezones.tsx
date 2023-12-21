import { SetStateAction, useState, Dispatch, useEffect } from "react";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { arrayRange } from "~/utils/index";
import type { HoursFormat } from "~/atoms/hours-format";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

export function getTimeDials(
  clock: string,
  offset: number,
  hoursFormat: HoursFormat = "24"
): Array<number> {
  const startHours = parseInt(clock.split(" ")[0].split(":")[0]);
  const hours = arrayRange(startHours, startHours + 23);
  return hours.map((hour) => {
    let h = hour;
    if (isDecimal(offset)) {
      h += 0.5;
    }
    // handling 24/12 hours and edge cases coz some countries like Myanmar is off by -30mins
    return hoursFormat === "24"
      ? h % 24 === 0.5
        ? 24.5
        : h % 24 || 24
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

export interface Timezone {
  name: string;
  value: string;
  abbr: string;
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

function populateTimezones(hoursFormat: HoursFormat): Timezone[] {
  const hour = hoursFormat === "24" ? "k" : "h";
  const strFormat = `eee, MMM d, y, ${hour}:mm a, zzz, zzzz`;
  const date = new Date();

  return getSupportedTimezonesName().map((name) => {
    const now = formatInTimeZone(date, name, strFormat);
    const [dayOfWeek, monthAndDay, year, clock, abbr, value] = now.split(", ");
    const offset = getTimezoneOffset(name, date) / (60 * 60 * 1_000);
    return {
      name,
      value,
      abbr,
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

const MILISECONDS_PER_MIN = 60_000;

export function useTimezones(
  hoursFormat: HoursFormat = "24",
  defaultTimezones?: Timezone[]
): UseTimezonesReturnType {
  function initTimezones() {
    return defaultTimezones || populateTimezones(hoursFormat);
  }

  const [timezones, setTimezones] = useState(initTimezones);

  useEffect(() => {
    setTimezones((preTimezones) => {
      return preTimezones.map((preTz) => {
        return {
          ...preTz,
          clock: currentTime(preTz.name, hoursFormat),
        };
      });
    });
  }, [hoursFormat]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;
    const intervalId = setInterval(() => {
      setTimezones((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          clock: currentTime(tz.name, hoursFormat),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, [timezones]);

  return [timezones, setTimezones];
}

function currentTime(timezoneName: string, hoursFormat: HoursFormat) {
  const date = new Date();
  const hour = hoursFormat === "24" ? "k" : "h";
  const strFormat = `${hour}:mm a`;

  return formatInTimeZone(date, timezoneName, strFormat);
}
