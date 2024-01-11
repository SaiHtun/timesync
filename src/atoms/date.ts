import { atom } from "jotai";
import {
  Timezone,
  getCurrentUserTimezoneName,
  getNextDay,
} from "~/utils/hooks/use-timezones";
import { arrayRange } from "../utils";
import { getTimezone } from "./selected-timezones";

export type CurrentDate = {
  name: string;
  dateIndex: number;
};

type TimeSlices = Array<"dayOfWeek" | "monthAndDay" | "year">;

export function formatTimeString(timezone: Timezone, timeSlices: TimeSlices) {
  let timeString = "";
  for (const slice of timeSlices) {
    timeString += timeString ? `, ${timezone[slice]}` : `${timezone[slice]}`;
  }
  return timeString;
}

export const datesAtom = atom(() => {
  const localTz = getTimezone(getCurrentUserTimezoneName());
  const t = formatTimeString(localTz!, ["dayOfWeek", "monthAndDay", "year"]);
  return arrayRange(0, 3).map((val, index) => ({
    name: getNextDay(t, val),
    dateIndex: index,
  }));
});

export const currentDateAtom = atom<CurrentDate>({
  name: formatTimeString(getTimezone(getCurrentUserTimezoneName())!, [
    "dayOfWeek",
    "monthAndDay",
  ]),
  dateIndex: 0,
});

export const setCurrentDateAtom = atom(null, (_, set, date: CurrentDate) =>
  set(currentDateAtom, date)
);
