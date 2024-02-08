import { SetStateAction, Dispatch, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import {
  homeSelectedTimezonesAtom,
  selectedTimezonesAtom,
} from "~/atoms/selected-timezones";

import { selectedDateAtom } from "~/atoms/date";
import {
  currentTime,
  getDailyCircleColor,
  getDifferenceHoursFromHome,
  getTimeDials,
} from "~/utils/timezones";
import { MILISECONDS_PER_MIN } from "~/constants/index";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";
import { formatInTimeZone } from "date-fns-tz";

export function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<ITimezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, [
    setTimezonesClock,
  ]);
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [homeSelectedTimezone] = useAtom(homeSelectedTimezonesAtom);

  useEffect(() => {
    let h = homeSelectedTimezone;
    const { date, hour12, abbr } = h;

    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((tz, index) => {
        if (index === 0) {
          tz.diffHoursFromHome = getDifferenceHoursFromHome(h.name, h.name);
          tz.timeDials = getTimeDials(h, dialColor, h, true);
          h = tz;
        } else {
          const d = `${date}, ${hour12}, ${abbr}`;
          const nd = formatInTimeZone(new Date(d), tz.name, "eee, MMM d, y");
          tz.date = nd;
          tz.diffHoursFromHome = getDifferenceHoursFromHome(tz.name, h.name);
          tz.timeDials = getTimeDials(tz, dialColor, h);
        }

        return tz;
      });

      return newTimezones;
    });
  }, [selectedDate, homeSelectedTimezone]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;

    const intervalId = setInterval(() => {
      setTimezonesClockCb((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          hour12: currentTime(tz.name, "hour12"),
          hour24: currentTime(tz.name, "hour24"),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, [setTimezonesClockCb]);
}

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

export function useSelectedTimezones(): [
  ITimezone[],
  SetAtom<[SetStateAction<ITimezone[]>], void>
] {
  const [selectedTimezones, setSelectedTimezones] = useAtom(
    selectedTimezonesAtom
  );
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);

  useUpdateTimezonesClock(setSelectedTimezones);

  useEffect(() => {
    setSelectedTimezones((prevTimezones) => {
      return prevTimezones.map((tz) => {
        const timeDials = tz.timeDials.map((td) => {
          const { timeMeridian, hour12, hour24 } = td;
          const isNewDay =
            (timeMeridian === "am" && (hour12 === 12 || hour12 === 12.5)) ||
            hour24 === 24 ||
            hour24 === 24.5;
          return {
            ...td,
            dailyCircleBgColor: getDailyCircleColor(
              td.hour24,
              dialColor,
              isNewDay
            ),
          };
        });

        return { ...tz, timeDials };
      });
    });
  }, [dialColor]);

  return [selectedTimezones, setSelectedTimezones];
}
