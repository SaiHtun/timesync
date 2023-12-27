import { atom } from "jotai";
import { Timezone, getTimezonesMap } from "~/utils/hooks/use-timezones";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";

let timezonesMap = new Map<string, Timezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}

export const selectedTimezonesAtom = atom<Timezone[]>([]);

export const syncUrlToSelectedTimezonesAtom = atom(
  null,
  (get, set, timezonesName: string[]) => {
    set(selectedTimezonesAtom, (preTzs) => {
      const timezones = timezonesName
        .filter(
          (tn) =>
            !get(selectedTimezonesAtom).find(
              (selectedTimezone) => selectedTimezone.name === tn
            )
        )
        .map(
          (timezoneName) =>
            timezonesMap.get(timezoneName) ||
            timezonesMap.get("defaultTimezone")!
        );
      return preTzs.concat(timezones);
    });
  }
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

      set(searchTimezoneNameAtom, "");
    }
  }
);
