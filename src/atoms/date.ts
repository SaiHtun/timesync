import { differenceInDays } from "date-fns";
import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import {
  getCurrentUserTimezoneName,
  getLocalTime,
  getNextDay,
} from "~/utils/timezones";

export const startedMonthAtom = atom((get) => {
  return get(selectedDateAtom).date.split(", ")[1].split(" ")[0];
});

function getDates(startDate: { name: string; date: string }) {
  return arrayRange(0, 3).map((val) => {
    return {
      name: startDate?.name || getCurrentUserTimezoneName(),
      date: getNextDay(startDate.date, val),
    };
  });
}

export const datesAtom = atom(
  getDates({
    name: getCurrentUserTimezoneName(),
    date: getLocalTime("eee, MMM d, y"),
  })
);

export const readWriteDatesAtom = atom(
  (get) => {
    const dates = get(datesAtom);

    const selectedDate = get(selectedDateAtom);

    const foundDate = dates.find(
      (d) =>
        d.date.split(", ").slice(0, 3).join(", ") ===
        selectedDate.date.split(", ").slice(0, 3).join(", ")
    );

    if (foundDate && selectedDate.name !== foundDate.name) {
      return dates.map((d) => ({ ...d, name: selectedDate.name }));
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

export const selectedDateAtom = atom({
  name: getCurrentUserTimezoneName(),
  date: getLocalTime("eee, MMM d, y"),
});

export const prevdiffDatesFromLocalTimeAtom = atom((get) => {
  const selectedDate = get(selectedDateAtom);
  const diffDatesFromLocalTime = differenceInDays(
    new Date(selectedDate.date),
    new Date(getLocalTime())
  );

  return diffDatesFromLocalTime;
});

export const isDatePickerModelOpenAtom = atom(false);

export const dismissDatePickerModelAtom = atom(null, (_, set) =>
  set(isDatePickerModelOpenAtom, false)
);
