import { atom } from "jotai";
import { atomWithLocation } from "jotai-location";
import { getCurrentUserTimezoneName, getLocalTime } from "~/utils/timezones";

export const urlAtom = atomWithLocation();

export const readWriteUrlTimezonesNameAtom = atom(
  (get) => {
    const names = get(urlAtom).searchParams?.get("timezones") || "[]";
    const parsedNames = JSON.parse(names);
    if (!parsedNames.length) {
      parsedNames.push(getCurrentUserTimezoneName());
    }

    return parsedNames;
  },
  (get, set, timezoneName: string) => {
    const names = get(urlAtom).searchParams?.get("timezones") || "[]";
    const parsedNames = JSON.parse(names) as string[];

    if (!parsedNames.length) {
      parsedNames.push(getCurrentUserTimezoneName());
    }

    const isFoundName = parsedNames.find((n) => n === timezoneName);

    if (!isFoundName) {
      parsedNames.push(timezoneName);
      set(urlAtom, (prev) => {
        if (!prev.searchParams?.has("timezones")) {
          prev.searchParams?.append("timezones", JSON.stringify(parsedNames));
        } else {
          prev.searchParams?.set("timezones", JSON.stringify(parsedNames));
        }

        return prev;
      });
    }

    return;
  }
);

export const setUrlTimezonesNameAtom = atom(
  null,
  (_, set, timezonesName: string[]) => {
    set(urlAtom, (prev) => {
      prev.searchParams?.set("timezones", JSON.stringify(timezonesName));

      return prev;
    });
  }
);

export const popUrlTimezonesNameAtom = atom(
  null,
  (get, set, timezoneName: string) => {
    const timezonesName = get(urlAtom);

    const tzs = timezonesName.searchParams?.get("timezones");
    if (tzs) {
      let parsedTzs = JSON.parse(tzs) as string[];

      const idx = parsedTzs.findIndex((tz) => tz === timezoneName);
      parsedTzs.splice(idx, 1);

      set(urlAtom, (prev) => {
        prev.searchParams?.set("timezones", JSON.stringify(parsedTzs));

        return prev;
      });
    }
  }
);

export const readWriteUrlSelectedDateAtom = atom(
  (get) => {
    const urlSelectedDate = get(urlAtom).searchParams?.get("selectedDate");

    return urlSelectedDate ? urlSelectedDate : getLocalTime("eee, MMM d, y");
  },
  (_, set, date: string) => {
    set(urlAtom, (prev) => {
      if (!prev.searchParams?.has("selectedDate")) {
        prev.searchParams?.append("selectedDate", date);
      } else {
        prev.searchParams?.set("selectedDate", date);
      }

      return prev;
    });
  }
);
