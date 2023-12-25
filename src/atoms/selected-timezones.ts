import { PrimitiveAtom, atom } from "jotai";
import {
  Timezone,
  getCurrentUserTimezoneName,
  getTimezonesMap,
} from "~/utils/hooks/use-timezones";
import { searchTimezoneAtom } from "~/atoms/search-timezone";

let timezonesMap = new Map();

function createSelectedTimezones(
  timezoneName: string
): PrimitiveAtom<Timezone[]> {
  if (timezonesMap.size === 0) {
    timezonesMap = getTimezonesMap();
  }
  const timezone = timezonesMap.get(timezoneName);
  return atom<Timezone[]>([timezone]);
}

export const selectedTimezonesAtom = createSelectedTimezones(
  getCurrentUserTimezoneName()
);

export const addSelectedTimezonesAtom = atom(
  null,
  (get, set, timezone: Timezone) => {
    const timezones = get(selectedTimezonesAtom);
    const isExist =
      timezones.some((tz) => tz.name === timezone.name) || timezones.length > 9;

    if (!isExist) {
      set(selectedTimezonesAtom, (prevTimezones) =>
        prevTimezones.concat(timezone)
      );

      set(searchTimezoneAtom, "");
    }
  }
);
