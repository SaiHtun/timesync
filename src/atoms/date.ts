import { atom } from "jotai";
import { arrayRange } from "~/utils/index";
import { getCurrentUserTimezoneName, getNextDay } from "~/utils/timezones";
import { formatInTimeZone } from "date-fns-tz";

export type CurrentDate = {
  name: string;
  dateIndex: number;
};

function getLocalTime() {
  const res = formatInTimeZone(
    new Date(),
    getCurrentUserTimezoneName(),
    "eee, MMM d, y"
  );
  return res;
}

export const datesAtom = atom(() => {
  const t = getLocalTime();
  return arrayRange(0, 3).map((val, index) => ({
    name: getNextDay(t, val),
    dateIndex: index,
  }));
});

export const currentDateAtom = atom<CurrentDate>({
  name: getLocalTime(),
  dateIndex: 0,
});

export const setCurrentDateAtom = atom(null, (_, set, date: CurrentDate) =>
  set(currentDateAtom, date)
);
