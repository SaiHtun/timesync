import { differenceInDays } from "date-fns";
import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import { getLocalTime, getNextDay } from "~/utils/timezones";

export const startedMonthAtom = atom((get) => {
  return get(selectedDateAtom).split(", ")[1].split(" ")[0];
});

function getDates(startDate: string) {
  return arrayRange(0, 3).map((val) => getNextDay(startDate, val));
}

export const datesAtom = atom(getDates(getLocalTime("eee, MMM d, y")));

export const readWriteDatesAtom = atom(
  (get) => {
    const dates = get(datesAtom);

    const selectedDate = get(selectedDateAtom);

    const foundDate = dates.find(
      (d) =>
        d.split(", ").slice(0, 3).join(", ") ===
        selectedDate.split(", ").slice(0, 3).join(", ")
    );

    if (foundDate && selectedDate !== foundDate) {
      return dates.map(() => selectedDate);
    }

    if (!foundDate) {
      return getDates(selectedDate);
    }

    return dates;
  },
  (get, set) => {
    set(datesAtom, getDates(get(selectedDateAtom)));
  }
);

export const selectedDateAtom = atom(getLocalTime("eee, MMM d, y"));

export const prevdiffDatesFromLocalTimeAtom = atom((get) => {
  const selectedDate = get(selectedDateAtom);
  const diffDatesFromLocalTime = differenceInDays(
    new Date(selectedDate),
    new Date(getLocalTime())
  );

  return diffDatesFromLocalTime;
});

export const isDatePickerModelOpenAtom = atom(false);

export const dismissDatePickerModelAtom = atom(null, (_, set) =>
  set(isDatePickerModelOpenAtom, false)
);
