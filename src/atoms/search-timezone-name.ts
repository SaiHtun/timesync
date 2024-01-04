import { atom } from "jotai";

export const searchTimezoneNameAtom = atom("");

export const setSearchTimezoneNameAtom = atom(
  null,
  (_, set, timezoneName: string) => {
    set(searchTimezoneNameAtom, timezoneName);
  }
);
