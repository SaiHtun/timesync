import { atom } from "jotai";
import { atomWithLocation } from "jotai-location";
import { getCurrentUserTimezoneName } from "~/utils/timezones";

export const urlTimezonesNameAtom = atomWithLocation();

export const readWriteUrlTimezonesNameAtom = atom(
  (get) => {
    const names =
      get(urlTimezonesNameAtom).searchParams?.get("timezones") || "[]";
    const parsedNames = JSON.parse(names);
    if (!parsedNames.length) {
      parsedNames.push(getCurrentUserTimezoneName());
    }

    return parsedNames;
  },
  (get, set, timezoneName: string) => {
    const names =
      get(urlTimezonesNameAtom).searchParams?.get("timezones") || "[]";
    const parsedNames = JSON.parse(names) as string[];

    if (!parsedNames.length) {
      parsedNames.push(getCurrentUserTimezoneName());
    }

    const isFoundName = parsedNames.find((n) => n === timezoneName);

    if (!isFoundName) {
      parsedNames.push(timezoneName);
      set(urlTimezonesNameAtom, (prev) => {
        if (!prev.searchParams?.has("timezones")) {
          console.log("no timezones..");
          prev.searchParams?.append("timezones", JSON.stringify(parsedNames));
        } else {
          console.log("has timzones..");
          prev.searchParams?.set("timezones", JSON.stringify(parsedNames));
        }

        return prev;
      });
    }
  }
);

export const setUrlTimezonesNameAtom = atom(
  null,
  (_, set, timezonesName: string[]) => {
    // set(urlTimezonesNameAtom, (prev) => {
    //   prev.searchParams?.set("timezones", JSON.stringify(timezonesName));

    //   return prev;
    // });
    set(urlTimezonesNameAtom, (prev) => ({
      ...prev,
      searchParams: new URLSearchParams([
        ["timezones", JSON.stringify(timezonesName)],
      ]),
    }));
  }
);

export const popUrlTimezonesNameAtom = atom(
  null,
  (get, set, timezoneName: string) => {
    const timezonesName = get(urlTimezonesNameAtom);

    const tzs = timezonesName.searchParams?.get("timezones");
    if (tzs) {
      let parsedTzs = JSON.parse(tzs) as string[];

      const idx = parsedTzs.findIndex((tz) => tz === timezoneName);
      parsedTzs.splice(idx, 1);

      set(urlTimezonesNameAtom, (prev) => ({
        ...prev,
        searchParams: new URLSearchParams([
          ["timezones", JSON.stringify(parsedTzs)],
        ]),
      }));
    }
  }
);
