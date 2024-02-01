import { atom } from "jotai";
import {
  getCurrentUserTimezoneName,
  getDifferenceHoursFromHome,
  getTimeDials,
  getTimezonesMap,
} from "~/utils/timezones";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { searchedTimezoneIndexAtom } from "./searched-timezone-index";
import { searchedTimezonesAtom } from "./searched-timezones";
import { TIMEZONES_LIMIT } from "~/constants/index";

import { dialColorWithLocalStorageAtom } from "./dial-colors-model";

let timezonesMap = new Map<string, ITimezone>();
if (timezonesMap.size === 0) {
  timezonesMap = getTimezonesMap();
}
export const selectedTimezonesAtom = atom<ITimezone[]>([]);

export const appendSelectedTimezonesAtom = atom(null, (get, set) => {
  const selectedTimezones = get(selectedTimezonesAtom);
  const homeSelectedTimezone = get(homeSelectedTimezonesAtom);
  const dialColor = get(dialColorWithLocalStorageAtom);
  const newTimezone = get(searchedTimezonesAtom)[
    get(searchedTimezoneIndexAtom)
  ];
  const isExist = selectedTimezones.find((tz) => tz.name === newTimezone.name);

  if (selectedTimezones.length < TIMEZONES_LIMIT && !isExist) {
    set(selectedTimezonesAtom, (preTzs) => {
      newTimezone.diffHoursFromHome = getDifferenceHoursFromHome(
        newTimezone.name,
        homeSelectedTimezone.name
      );
      return preTzs.concat({
        ...newTimezone,
        timeDials: getTimeDials(newTimezone, dialColor, homeSelectedTimezone),
      });
    });
  }
  set(searchTimezoneNameAtom, "");
});

export const popSelectedTimezonesAtom = atom(
  null,
  (_, set, timezoneName: string) =>
    set(selectedTimezonesAtom, (preTzs) =>
      preTzs.filter(({ name }) => name !== timezoneName)
    )
);

export const selectedTimezonesLengthAtom = atom(
  (get) => get(selectedTimezonesAtom).length
);

export const syncUrlToSelectedTimezonesAtom = atom(
  null,
  (get, set, timezonesName: string[] = []) => {
    const dialColor = get(dialColorWithLocalStorageAtom);
    let homeSelectedTimezone = get(homeSelectedTimezonesAtom);

    const timezones = timezonesName.map((name, index) => {
      const timezone = timezonesMap.get(name) as ITimezone;

      timezone.diffHoursFromHome = getDifferenceHoursFromHome(
        timezone.name,
        homeSelectedTimezone.name
      );

      const timeDials = getTimeDials(
        timezone,
        dialColor,
        homeSelectedTimezone,
        index === 0
      );
      const newTimezone = { ...timezone, timeDials };

      if (index === 0) {
        homeSelectedTimezone = newTimezone;
      }

      return newTimezone;
    });

    set(selectedTimezonesAtom, timezones);
    set(searchTimezoneNameAtom, "");
  }
);

// the first timezone will always be HOME, and "diffHoursFromHome" will be re-caculated base on HOME
export const homeSelectedTimezonesAtom = atom(
  (get) =>
    get(selectedTimezonesAtom)[0] ||
    timezonesMap.get(getCurrentUserTimezoneName())
);
