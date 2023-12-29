import {
  SetStateAction,
  Dispatch,
  useEffect,
  useDeferredValue,
  useMemo,
  useCallback,
} from "react";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { arrayRange } from "~/utils/index";
import { hoursFormatAtom, type HoursFormat } from "~/atoms/hours-format";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";
import Fuse from "fuse.js";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import { searchedTimezonesAtom } from "~/atoms/searched-timezones";
import { colorsMap, DialColors } from "~/constants/colorsMap";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

// Todo:: Need to fix this. It takes forever to update the color!!!
function getDailyCircleMap(dialColor: "indigo" | "pink") {
  const c = colorsMap[dialColor];
  const map = new Map();
  map.set(arrayRange(6, 7).concat(arrayRange(6.5, 7.5)), c["dawn"]);
  map.set(arrayRange(8, 17).concat(arrayRange(8.5, 17.5)), c["midday"]);
  map.set(arrayRange(18, 21).concat(arrayRange(18.5, 21.5)), c["dusk"]);
  map.set(
    arrayRange(22, 23)
      .concat(arrayRange(22.5, 23.5))
      .concat(arrayRange(1, 5))
      .concat(arrayRange(1.5, 5.5)),
    c["midnight"]
  );

  map.set([24, 24.5], c["newday"]);

  return map;
}

function getDailyCircle(hour: number, dialColor: any) {
  const dailyCircleMap = getDailyCircleMap(dialColor);

  for (const hours of dailyCircleMap.keys()) {
    if (hours.includes(hour)) {
      return dailyCircleMap.get(hours);
    }
  }
}

type TimeDial = {
  hour: number;
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

export function getTimeDials(
  timezone: Timezone,
  hoursFormat: HoursFormat = "24",
  dialColor: DialColors = "teal"
): TimeDial[] {
  const { name, clock, offset } = timezone;

  const hours24 = getHours24(name);

  const startHours = parseInt(clock.split(" ")[0].split(":")[0]);
  const hours = arrayRange(startHours, startHours + 23);

  return hours.map((h, index) => {
    let hour = h;
    if (isDecimal(offset)) {
      hour += 0.5;
    }
    // handling 24/12 hours and edge cases coz some countries like Myanmar is off by -30mins
    hour =
      hoursFormat === "24"
        ? hour % 24 === 0.5
          ? 24.5
          : hour % 24 || 24
        : hour % 12 === 0.5
        ? 12.5
        : hour % 12 || 12;

    return {
      hour,
      dailyCircleBgColor: getDailyCircle(hours24[index], dialColor),
    };
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

  const parsedHome = new Date(homeTimezone) as unknown as number;
  const parsedOther = new Date(otherTimezone) as unknown as number;

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
  timeDials: TimeDial[];
}

function getSupportedTimezonesName(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

function populateTimezones(hoursFormat: HoursFormat = "24"): Timezone[] {
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

export function getTimezonesMap() {
  const defaultTimezone: Timezone = {
    name: "America/Los_Angeles",
    abbr: "HW",
    clock: "00:00 AM",
    dayOfWeek: "lol",
    diffHoursFromHome: "0",
    monthAndDay: "lol",
    offset: 0,
    timeDials: [],
    value: "lol",
    year: "1992",
  };
  const map = new Map<string | "defaultTimezone", Timezone>();
  const timezones = populateTimezones();

  map.set("defaultTimezone", defaultTimezone);
  timezones.forEach((timezone) => map.set(timezone.name, timezone));

  return map;
}

const MILISECONDS_PER_MIN = 60_000;

function currentTime(timezoneName: string, hoursFormat: HoursFormat) {
  const date = new Date();
  const hour = hoursFormat === "24" ? "k" : "h";
  const strFormat = `${hour}:mm a`;

  return formatInTimeZone(date, timezoneName, strFormat);
}

type UpdateTimezoneDependencies = {
  hoursFormat: HoursFormat;
};

function useUpdateTimezonesClock(
  timezones: Timezone[],
  setTimezonesClock: Dispatch<SetStateAction<Timezone[]>>,
  dependencies: UpdateTimezoneDependencies
): void {
  const { hoursFormat } = dependencies;
  const setTimezonesClockCb = useCallback(setTimezonesClock, [
    setTimezonesClock,
  ]);

  useEffect(() => {
    setTimezonesClockCb((preTimezones) => {
      return preTimezones.map((preTz) => {
        return {
          ...preTz,
          clock: currentTime(preTz.name, hoursFormat),
        };
      });
    });
  }, [hoursFormat, setTimezonesClockCb]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;
    const intervalId = setInterval(() => {
      setTimezonesClockCb((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          clock: currentTime(tz.name, hoursFormat),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, [timezones, setTimezonesClockCb, hoursFormat]);
}

export function useSelectedTimezones(): Timezone[] {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [selectedTimezones, setSelectedTimezones] = useAtom(
    selectedTimezonesAtom
  );

  useUpdateTimezonesClock(selectedTimezones, setSelectedTimezones, {
    hoursFormat,
  });

  return selectedTimezones;
}

export function useSearchedTimezones(): Timezone[] {
  const [hoursFormat] = useAtom(hoursFormatAtom);
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

  useUpdateTimezonesClock(filteredTimezones, setFilteredTimezones, {
    hoursFormat,
  });

  return filteredTimezones;
}
