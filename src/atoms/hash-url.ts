import { atom } from "jotai";
import { atomWithHash } from "jotai-location";
import { getLocalTime } from "~/utils/timezones";

const urlTimezoneNamesAtom = atomWithHash<string[]>("timezones", []);

export const readWriteUrlTimezonesNameAtom = atom(
  (get) => {
    const timezoneNames = get(urlTimezoneNamesAtom);
    return timezoneNames;
  },
  (get, set, timezoneName: string[] | string) => {
    if (Array.isArray(timezoneName)) {
      set(urlTimezoneNamesAtom, timezoneName);
    } else {
      const timezoneNames = get(urlTimezoneNamesAtom);
      if (!timezoneNames.find((tn) => tn === timezoneName)) {
        timezoneNames.push(timezoneName);
        set(urlTimezoneNamesAtom, timezoneNames);
      }
    }
  }
);

export const deleteUrlTimezoneNameAtom = atom(
  null,
  (get, set, timezoneName: string) => {
    const timezoneNames = get(urlTimezoneNamesAtom);

    if (timezoneNames.length) {
      const idx = timezoneNames.findIndex((tn) => tn === timezoneName);
      timezoneNames.splice(idx, 1);

      set(urlTimezoneNamesAtom, timezoneNames);
    }
  }
);

const urlSelectedDateAtom = atomWithHash<string>(
  "selectedDate",
  getLocalTime("eee, MMM d, y")
);

export const readWriteUrlSelectedDateAtom = atom(
  (get) => get(urlSelectedDateAtom),
  (_, set, date: string) => {
    set(urlSelectedDateAtom, date);
  }
);

export type TimeWindowIndexs = {
  start: number;
  end: number;
};

const urlTimeWindowIndexsAtom = atomWithHash<TimeWindowIndexs | null>(
  "timeWindowIndexes",
  null
);

export const readWriteUrlTimeWindowIndexesAtom = atom(
  (get) => get(urlTimeWindowIndexsAtom),
  (_, set, timeWindowIndexes: TimeWindowIndexs | null) => {
    set(urlTimeWindowIndexsAtom, timeWindowIndexes);
  }
);
