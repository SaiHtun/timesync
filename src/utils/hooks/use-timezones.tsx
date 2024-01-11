import {
  SetStateAction,
  Dispatch,
  useEffect,
  useDeferredValue,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { arrayRange } from "~/utils/index";
import type { HoursFormat } from "~/atoms/hours-format";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";
import Fuse from "fuse.js";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import { searchedTimezonesAtom } from "~/atoms/searched-timezones";
import { colorsMap, DialColors } from "~/constants/colorsMap";
import { addDays, format } from "date-fns";
import { currentDateAtom, formatTimeString } from "~/atoms/date";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

function getDailyCircleColor(hour: number, dialColor: DialColors) {
  const dailyCircleColor = colorsMap[dialColor];
  if (hour >= 6 && hour <= 7.5) {
    return dailyCircleColor["dawn"];
  } else if (hour >= 8 && hour <= 17.5) {
    return dailyCircleColor["midday"];
  } else if (hour >= 18 && hour <= 21.5) {
    return dailyCircleColor["dusk"];
  } else if ((hour >= 22 && hour <= 23.5) || (hour >= 1 && hour <= 5.5)) {
    return dailyCircleColor["midnight"];
  } else {
    return dailyCircleColor["newday"];
  }
}

export type TimeDial = {
  hour12: number;
  hour24: number;
  day: string;
  isNewDay: boolean;
  isLastHour: boolean;
  dailyCircleBgColor: string;
};

function getHours24(timezoneName: string): number[] {
  const startHours24 = parseInt(
    formatInTimeZone(new Date(), timezoneName, "k")
  );
  return arrayRange(startHours24, startHours24 + 23).map(
    (num) => num % 24 || 24
  );
}
// getNextDay could return pre/next day base on if "numberOfDays"(+/-)
export function getNextDay(currentTime: string, numberOfDays = 1): string {
  // currentTime = "dayOfWeek, monthAndDay, year" ( without year would Error :D )
  const date = new Date(currentTime);
  const nextDay = format(addDays(date, numberOfDays), "eee, MMM d");
  return nextDay;
}

export function getTimeDials(
  timezone: Timezone,
  dialColor: DialColors
): TimeDial[] {
  const { name, clock, offset } = timezone;
  const hours24Array = getHours24(name);
  const startHours = parseInt(clock.split(" ")[0].split(":")[0]);
  const hours = arrayRange(startHours, startHours + 23);

  const currentTime = formatTimeString(timezone, [
    "dayOfWeek",
    "monthAndDay",
    "year",
  ]);

  let startNewDay = false;

  const timeDials = hours.map((h, index) => {
    let hour = h;
    if (isDecimal(offset)) {
      hour += 0.5;
    }
    // handling 24/12 hours and edge cases coz some countries like Myanmar is off by -30mins
    const hour12 = hour % 12 === 0.5 ? 12.5 : hour % 12 || 12;
    const hour24 = hour % 24 === 0.5 ? 24.5 : hour % 24 || 24;

    // const day = formatTimeString(timezone, ["dayOfWeek", "monthAndDay"]);

    const isNewDay = hours[index] === 24;
    if (isNewDay) {
      startNewDay = true;
    }
    const isLastHour = hours[index] === 23;

    return {
      isNewDay,
      hour12,
      hour24,
      day: startNewDay ? getNextDay(currentTime) : currentTime,
      isLastHour,
      dailyCircleBgColor: getDailyCircleColor(hours24Array[index], dialColor),
    };
  });

  return timeDials;
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function diffHourFormat(diffHours: number) {
  return isDecimal(diffHours) ? diffHours.toFixed(1) : diffHours;
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

  const parsedHome = new Date(homeTimezone) as unknown as number;
  const parsedOther = new Date(otherTimezone) as unknown as number;

  const diffHours = (parsedOther - parsedHome) / (60 * 60 * 1000);

  return diffHours >= 0
    ? `+${diffHourFormat(diffHours)}`
    : `${diffHourFormat(diffHours)}`;
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
  timeDials: TimeDial[];
}

function getSupportedTimezonesName(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

function populateTimezones(hoursFormat: HoursFormat = "hour24"): Timezone[] {
  const hour = hoursFormat === "hour24" ? "k" : "h";
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

export function getTimezonesMap() {
  const map = new Map<string | "defaultTimezone", Timezone>();
  const timezones = populateTimezones();
  timezones.forEach((timezone) => map.set(timezone.name, timezone));

  return map;
}

const MILISECONDS_PER_MIN = 60_000;

export function currentTime(
  timezoneName: string,
  hoursFormat: HoursFormat = "hour24"
) {
  const date = new Date();
  const hour = hoursFormat === "hour24" ? "k" : "h";
  const strFormat = `${hour}:mm a`;

  return formatInTimeZone(date, timezoneName, strFormat);
}

function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<Timezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, []);
  const [currentDate] = useAtom(currentDateAtom);
  const prevDateIndexRef = useRef(0);

  useEffect(() => {
    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((prevTimezone) => {
        const t = formatTimeString(prevTimezone, [
          "dayOfWeek",
          "monthAndDay",
          "year",
        ]);
        const dateCounts = currentDate.dateIndex - prevDateIndexRef.current;
        const [dayOfWeek, monthAndDay] = getNextDay(t, dateCounts).split(", ");

        return { ...prevTimezone, dayOfWeek, monthAndDay };
      });
      prevDateIndexRef.current = currentDate.dateIndex;
      return newTimezones;
    });
  }, [currentDate]);

  useEffect(() => {
    setTimezonesClockCb((preTimezones) => {
      return preTimezones.map((preTz) => {
        return {
          ...preTz,
          clock: currentTime(preTz.name),
        };
      });
    });
  }, [setTimezonesClockCb]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;
    const intervalId = setInterval(() => {
      setTimezonesClockCb((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          clock: currentTime(tz.name),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, []);
}

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

export function useSelectedTimezones(): [
  Timezone[],
  SetAtom<[SetStateAction<Timezone[]>], void>
] {
  const [selectedTimezones, setSelectedTimezones] = useAtom(
    selectedTimezonesAtom
  );

  useUpdateTimezonesClock(setSelectedTimezones);

  return [selectedTimezones, setSelectedTimezones];
}

export function useSearchedTimezones(): Timezone[] {
  const timezones = useMemo(() => populateTimezones(), []);
  const [searchTimezoneName] = useAtom(searchTimezoneNameAtom);

  const deferredSearch = useDeferredValue(searchTimezoneName);
  const [filteredTimezones, setFilteredTimezones] = useAtom(
    searchedTimezonesAtom
  );

  useEffect(() => {
    const fusedTimezones = new Fuse(timezones, {
      keys: ["name", "abbr"],
    })
      .search(deferredSearch)
      .map((tz) => tz.item)
      .slice(0, 10);

    setFilteredTimezones(fusedTimezones);
  }, [deferredSearch, timezones]);

  useUpdateTimezonesClock(setFilteredTimezones);

  return filteredTimezones;
}
