import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import { getLocalTime, getNextDay } from "~/utils/timezones";

export const datesAtom = atom(() => {
  const t = getLocalTime();
  return arrayRange(0, 3).map((val) => getNextDay(t, val));
});

export const selectedDateAtom = atom(getLocalTime());
