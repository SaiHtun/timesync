import { atom } from "jotai";
import { searchedTimezonesLengthAtom } from "./searched-timezones";

export const searchedTimezoneIndexAtom = atom<number>(0);

export const keydownAddTimezoneIndexAtom = atom(
  null,
  (get, set, event: React.KeyboardEvent<HTMLDivElement>) => {
    const searchedTimezonesLength = get(searchedTimezonesLengthAtom);
    const currentIndex = get(searchedTimezoneIndexAtom);
    let index = currentIndex;
    if (event.code === "ArrowDown") {
      index = (currentIndex + 1) % searchedTimezonesLength;
    } else if (event.code === "ArrowUp") {
      index =
        (currentIndex - 1 + searchedTimezonesLength) % searchedTimezonesLength;
    }
    set(searchedTimezoneIndexAtom, index);
  }
);
