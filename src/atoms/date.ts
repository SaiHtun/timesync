import { differenceInDays, format } from "date-fns";
import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import {
  getCurrentUserTimezoneName,
  getLocalTime,
  getNextDay,
} from "~/utils/timezones";

export const startedDateAtom = atom(new Date(getLocalTime()));

export const startedMonthAtom = atom((get) => {
  const startedDate = get(startedDateAtom);
  const selectedDate = new Date(get(selectedDateAtom).date);
  return format(selectedDate || startedDate, "MMM");
});

// TODO:: add more properties on calendar's object.
export const datesAtom = atom((get) => {
  const selectedDate = get(selectedDateAtom);
  let date = selectedDate.date.split(", ");
  const abbr = date.splice(-1);

  const formatStr = "eee, MMM d, y, h:mm aaa, zzz";

  return arrayRange(0, 3).map((val) => {
    let d = getNextDay(date.join(", "), val, formatStr).split(", ");
    d.splice(-1);
    const dd = d.join(", ") + ", " + abbr;
    return {
      name: selectedDate.name,
      date: dd,
    };
  });
});

export const selectedDateAtom = atom({
  name: getCurrentUserTimezoneName(),
  date: getLocalTime(),
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
