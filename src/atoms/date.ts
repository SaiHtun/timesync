import { atom } from "jotai";
import {
  getCurrentUserTimezoneName,
  getNextDay,
} from "~/utils/hooks/use-timezones";
import { arrayRange } from "../utils";
import { getTimezone } from "./selected-timezones";

export type CurrentDate = {
  date: string;
  index: number;
};

export const datesAtom = atom(() => {
  const g = getTimezone(getCurrentUserTimezoneName());
  const ct = g?.dayOfWeek + ", " + g?.monthAndDay;
  return arrayRange(0, 3).map((val, index) => ({
    date: getNextDay(ct, val),
    index,
  }));
});

export const currentDateAtom = atom<CurrentDate>({
  date: "",
  index: 0,
});

export const setCurrentDateAtom = atom(null, (_, set, date: CurrentDate) =>
  set(currentDateAtom, date)
);
