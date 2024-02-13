import { atom } from "jotai";
import {
  keydownAddTimezoneIndexAtom,
  searchedTimezoneIndexAtom,
} from "./searched-timezone-index";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { appendSelectedTimezonesAtom } from "./selected-timezones";
import { dismissDatePickerModelAtom } from "./date";

export const searchedTimezonesAtom = atom<ITimezone[]>([]);

export const searchedTimezonesLengthAtom = atom(
  (get) => get(searchedTimezonesAtom).length
);

export const searchedSelectedTimezoneAtom = atom((get) => {
  return get(searchedTimezonesAtom)[get(searchedTimezoneIndexAtom)];
});

type KeydownArgs = {
  e: React.KeyboardEvent<HTMLElement>;
};

export const handleKeydownSearchedTimezoneAtom = atom(
  null,
  (_, set, { e }: KeydownArgs) => {
    if (e.code === "Enter") {
      set(appendSelectedTimezonesAtom);
    } else if (e.code === "Escape") {
      set(searchTimezoneNameAtom, "");
      set(dismissDatePickerModelAtom);
    }

    set(keydownAddTimezoneIndexAtom, e);
  }
);
