import { atom } from "jotai";
import {
  formatTimezoneToDateString,
  getLocalTime,
  getNextDay,
  getTimezonesMap,
} from "~/utils/timezones";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { searchedTimezoneIndexAtom } from "./searched-timezone-index";
import { searchedTimezonesAtom } from "./searched-timezones";
import { TIMEZONES_LIMIT } from "~/constants/index";
import { differenceInDays } from "date-fns";
import { selectedDateAtom } from "./date";

let timezonesMap = new Map<string, ITimezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}
export const selectedTimezonesAtom = atom<ITimezone[]>([]);

function massageTimezone(timezone: ITimezone, selectedDate: string): ITimezone {
  // newly added "Timezone" has to sync the "currentDate".
  const formattedCurrentDate = formatTimezoneToDateString(timezone, [
    "dayOfWeek",
    "monthAndDay",
    "year",
  ]);
  const diffDatesFromLocalTime = differenceInDays(
    new Date(selectedDate),
    new Date(getLocalTime())
  );
  const [dayOfWeek, monthAndDay] = getNextDay(
    formattedCurrentDate,
    diffDatesFromLocalTime
  ).split(", ");

  return { ...timezone, dayOfWeek, monthAndDay };
}

export const appendSelectedTimezonesAtom = atom(null, (get, set) => {
  const selectedTimezones = get(selectedTimezonesAtom);
  const selectedDate = get(selectedDateAtom);
  const newTimezone = get(searchedTimezonesAtom)[
    get(searchedTimezoneIndexAtom)
  ];
  const isExist = selectedTimezones.find((tz) => tz.name === newTimezone.name);

  if (selectedTimezones.length < TIMEZONES_LIMIT && !isExist) {
    set(selectedTimezonesAtom, (preTzs) =>
      preTzs.concat(massageTimezone(newTimezone, selectedDate))
    );
  }
  set(searchTimezoneNameAtom, "");
});

export const popSelectedTimezonesAtom = atom(
  null,
  (_, set, timezoneName: string) =>
    set(selectedTimezonesAtom, (preTzs) =>
      preTzs.filter(({ name }) => name !== timezoneName)
    )
);

export const selectedTimezonesLengthAtom = atom(
  (get) => get(selectedTimezonesAtom).length
);

export const syncUrlToSelectedTimezonesAtom = atom(
  null,
  (_, set, timezonesName: string[] = []) => {
    const timezones = timezonesName.map(
      (name) => timezonesMap.get(name) as ITimezone
    );
    set(selectedTimezonesAtom, timezones);
    set(searchTimezoneNameAtom, "");
  }
);

// the first timezone will always be HOME, and "diffHoursFromHome" will be re-caculated base on HOME
export const homeSelectedTimezonesAtom = atom(
  (get) => get(selectedTimezonesAtom)[0]
);
