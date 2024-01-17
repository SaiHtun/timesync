import { format } from "date-fns";
import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import { getLocalTime, getNextDay } from "~/utils/timezones";

export const startedDateAtom = atom(new Date(getLocalTime()));

export const datesAtom = atom((get) => {
  const startedDate = format(get(startedDateAtom), "eee, MMM d, y");
  return arrayRange(0, 3).map((val) => getNextDay(startedDate, val));
});

export const selectedDateAtom = atom(getLocalTime());

export const setSelectedDateAtom = atom(
  (get) => get(selectedDateAtom),
  (_, set, newDate: string) => set(selectedDateAtom, newDate)
);

export const isDatePickerModelOpenAtom = atom(false);

export const dismissDatePickerModelAtom = atom(null, (_, set) =>
  set(isDatePickerModelOpenAtom, false)
);
