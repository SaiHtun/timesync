import { atom } from "jotai";
import { Timezone, getTimezonesMap } from "~/utils/hooks/use-timezones";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { searchedTimezoneIndexAtom } from "./searched-timezone-index";
import { searchedTimezonesAtom } from "./searched-timezones";

let timezonesMap = new Map<string, Timezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}

export const selectedTimezonesAtom = atom<Timezone[]>([]);

const TIMEZONES_LIMIT = 10;

export const appendSelectedTimezonesAtom = atom(null, (get, set) => {
  const selectedTimezones = get(selectedTimezonesAtom);
  const newTimezone = get(searchedTimezonesAtom)[
    get(searchedTimezoneIndexAtom)
  ];
  const isExist = selectedTimezones.find((tz) => tz.name === newTimezone.name);

  if (selectedTimezones.length <= TIMEZONES_LIMIT && !isExist) {
    set(selectedTimezonesAtom, (preTzs) => preTzs.concat(newTimezone));
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
      (name) => timezonesMap.get(name) as Timezone
    );
    set(selectedTimezonesAtom, timezones);
    set(searchTimezoneNameAtom, "");
  }
);

// the first timezone will always be HOME, and "diffHoursFromHome" will be re-caculated base on HOME
export const homeSelectedTimezonesAtom = atom(
  (get) => get(selectedTimezonesAtom)[0]
);
