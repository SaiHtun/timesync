import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import { getLocalTime, getNextDay } from "~/utils/timezones";
import { readWriteUrlSelectedDateAtom } from "./url-timezones-name";

export const startedMonthAtom = atom((get) => {
  return get(readWriteSelectedDateAtom).split(", ")[1].split(" ")[0];
});

function getDates(startDate: string) {
  return arrayRange(0, 3).map((val) => getNextDay(startDate, val));
}

export const datesAtom = atom(getDates(getLocalTime("eee, MMM d, y")));

export const readWriteDatesAtom = atom(
  (get) => {
    const dates = get(datesAtom);

    const selectedDate = get(readWriteSelectedDateAtom);

    const foundDate = dates.find((d) => d === selectedDate);

    if (!foundDate) {
      return getDates(selectedDate);
    }

    return dates;
  },
  (get, set) => {
    const sd = get(readWriteSelectedDateAtom);
    set(datesAtom, getDates(sd));
  }
);

export const selectedDateAtom = atom("");

export const readWriteSelectedDateAtom = atom(
  (get) => {
    const urlSelectedDate = get(readWriteUrlSelectedDateAtom);
    const selectedDate = get(selectedDateAtom);

    return selectedDate || urlSelectedDate || getLocalTime("eee, MMM d, y");
  },
  (_, set, date: string) => {
    set(selectedDateAtom, date);
    set(readWriteUrlSelectedDateAtom, date);
  }
);

export const isDatePickerModelOpenAtom = atom(false);

export const dismissDatePickerModelAtom = atom(null, (_, set) =>
  set(isDatePickerModelOpenAtom, false)
);
