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
import {
  popUrlTimezonesNameAtom,
  readWriteUrlTimezonesNameAtom,
} from "./url-timezones-name";
import { addMinutes, format } from "date-fns";
import { readWriteSelectedDateAtom } from "./date";

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

      const dateStr = `${homeSelectedTimezone.date}, ${homeSelectedTimezone.hour12}`;
      const newDate = addMinutes(
        new Date(dateStr),
        (newTimezone.offset - homeSelectedTimezone.offset) * 60
      );

      newTimezone.date = format(newDate, "eee, MMM d, y");

      newTimezone.timeDials = getTimeDials(
        newTimezone,
        dialColor,
        homeSelectedTimezone
      );

      return preTzs.concat(newTimezone);
    });

    set(readWriteUrlTimezonesNameAtom, newTimezone.name);
  }
  set(searchTimezoneNameAtom, "");
});

export const popSelectedTimezonesAtom = atom(
  null,
  (_, set, timezoneName: string) => {
    set(selectedTimezonesAtom, (preTzs) =>
      preTzs.filter(({ name }) => name !== timezoneName)
    );

    set(popUrlTimezonesNameAtom, timezoneName);
  }
);

export const selectedTimezonesLengthAtom = atom(
  (get) => get(selectedTimezonesAtom).length
);

export const syncUrlToSelectedTimezonesAtom = atom(
  null,
  (get, set, timezonesName: string[] = []) => {
    const selectedDate = get(readWriteSelectedDateAtom);
    let homeSelectedTimezone = get(homeSelectedTimezonesAtom);
    homeSelectedTimezone.date = selectedDate;

    const dialColor = get(dialColorWithLocalStorageAtom);

    const timezones = timezonesName.map((name, index) => {
      const timezone = timezonesMap.get(name) as ITimezone;

      timezone.diffHoursFromHome = getDifferenceHoursFromHome(
        timezone.name,
        homeSelectedTimezone.name
      );

      timezone.timeDials = getTimeDials(
        timezone,
        dialColor,
        homeSelectedTimezone,
        index === 0
      );

      if (index !== 0) {
        const d =
          homeSelectedTimezone.date + ", " + homeSelectedTimezone.hour12;

        timezone.date = format(
          addMinutes(
            new Date(d),
            (timezone.offset - homeSelectedTimezone.offset) * 60
          ),
          "eee, MMM d, y"
        );
      }

      return timezone;
    });

    set(selectedTimezonesAtom, timezones);
    set(searchTimezoneNameAtom, "");
  }
);

// the first timezone will always be HOME, and "diffHoursFromHome" will be re-caculated base on HOME
export const homeSelectedTimezonesAtom = atom((get) => {
  const firstTimezoneName = get(readWriteUrlTimezonesNameAtom)[0];
  const timezone =
    get(selectedTimezonesAtom)[0] ||
    timezonesMap.get(firstTimezoneName || getCurrentUserTimezoneName());

  // console.log("Home::", timezone);

  return timezone;
});
