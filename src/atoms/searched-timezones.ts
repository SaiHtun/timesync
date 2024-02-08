import { atom } from "jotai";
import {
  keydownAddTimezoneIndexAtom,
  searchedTimezoneIndexAtom,
} from "./searched-timezone-index";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { appendSelectedTimezonesAtom } from "./selected-timezones";
import { dismissDatePickerModelAtom } from "./date";
import { urlTimezonesNameAtom } from "./url-timezones-name";

export const searchedTimezonesAtom = atom<ITimezone[]>([]);

export const searchedTimezonesLengthAtom = atom(
  (get) => get(searchedTimezonesAtom).length
);

export const searchedSelectedTimezoneAtom = atom((get) => {
  return get(searchedTimezonesAtom)[get(searchedTimezoneIndexAtom)];
});

type KeydownArgs = {
  e: React.KeyboardEvent<HTMLDivElement>;
};

export const handleKeydownSearchedTimezoneAtom = atom(
  null,
  (get, set, { e }: KeydownArgs) => {
    if (e.code === "Enter") {
      const newTimezoneName = get(searchedSelectedTimezoneAtom).name;
      set(
        urlTimezonesNameAtom,
        get(urlTimezonesNameAtom).concat(newTimezoneName)
      );
      set(appendSelectedTimezonesAtom);
    } else if (e.code === "Escape") {
      set(searchTimezoneNameAtom, "");
      set(dismissDatePickerModelAtom);
    }

    set(keydownAddTimezoneIndexAtom, e);
  }
);
