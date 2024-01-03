import { atom } from "jotai";
import { Timezone, getTimezonesMap } from "~/utils/hooks/use-timezones";
import { searchTimezoneNameAtom } from "./search-timezone-name";

let timezonesMap = new Map<string, Timezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}

export const selectedTimezonesAtom = atom<Timezone[]>([]);

export const selectedTimezonesLengthAtom = atom(
  (get) => get(selectedTimezonesAtom).length
);

export const syncUrlToSelectedTimezonesAtom = atom(
  null,
  (get, set, timezonesName: string[] = []) => {
    set(selectedTimezonesAtom, (preTzs) => {
      const timezones = timezonesName
        .filter(
          (tn) =>
            !get(selectedTimezonesAtom).find(
              (selectedTimezone) => selectedTimezone.name === tn
            )
        )
        .map(
          (timezoneName) =>
            timezonesMap.get(timezoneName) ||
            timezonesMap.get("defaultTimezone")!
        );
      return preTzs.concat(timezones);
    });
    set(searchTimezoneNameAtom, "");
  }
);

// the first timezone will always be HOME, and "diffHoursFromHome" will be re-caculated base on HOME
export const homeSelectedTimezonesAtom = atom(
  (get) => get(selectedTimezonesAtom)[0]
);
