import { atom } from "jotai";
import {
  formatCurrentTime,
  getNextDay,
  getTimezonesMap,
} from "~/utils/timezones";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { searchedTimezoneIndexAtom } from "./searched-timezone-index";
import { searchedTimezonesAtom } from "./searched-timezones";
import { TIMEZONES_LIMIT } from "~/constants/index";
import { CurrentDate, currentDateAtom } from "./date";

let timezonesMap = new Map<string, ITimezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}
export const selectedTimezonesAtom = atom<ITimezone[]>([]);

function massageTimezone(
  timezone: ITimezone,
  currentDate: CurrentDate
): ITimezone {
  // newly added "Timezone" has to sync the "currentDate".
  const [dayOfWeek, monthAndDay] = getNextDay(
    formatCurrentTime(timezone, ["dayOfWeek", "monthAndDay", "year"]),
    currentDate.dateIndex
  ).split(", ");

  return { ...timezone, dayOfWeek, monthAndDay };
}

export const appendSelectedTimezonesAtom = atom(null, (get, set) => {
  const selectedTimezones = get(selectedTimezonesAtom);
  const currentDate = get(currentDateAtom);
  const newTimezone = get(searchedTimezonesAtom)[
    get(searchedTimezoneIndexAtom)
  ];
  const isExist = selectedTimezones.find((tz) => tz.name === newTimezone.name);

  if (selectedTimezones.length < TIMEZONES_LIMIT && !isExist) {
    set(selectedTimezonesAtom, (preTzs) =>
      preTzs.concat(massageTimezone(newTimezone, currentDate))
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
