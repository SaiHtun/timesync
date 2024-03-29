import { SetStateAction, Dispatch, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import {
  homeSelectedTimezonesAtom,
  selectedTimezonesAtom,
} from "~/atoms/selected-timezones";

import { readWriteSelectedDateAtom } from "~/atoms/date";
import {
  currentTime,
  getDailyCircleBgColor,
  getTimeDials,
} from "~/utils/timezones";
import { MILISECONDS_PER_MIN } from "~/constants/index";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";
import { addMinutes, format } from "date-fns";

export function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<ITimezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, [
    setTimezonesClock,
  ]);
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);
  const [selectedDate] = useAtom(readWriteSelectedDateAtom);
  const [homeSelectedTimezone] = useAtom(homeSelectedTimezonesAtom);

  useEffect(() => {
    setTimezonesClockCb((prevTimezones) => {
      let home = homeSelectedTimezone;
      const newTimezones = prevTimezones.map((tz, index) => {
        if (index === 0) {
          tz.date = selectedDate;
          tz.timeDials = home.timeDials.map((td) => {
            const hours = td.date.split(", ").pop();
            const newDate = `${tz.date}, ${hours}`;
            return { ...td, date: newDate };
          });
          home = tz;

          return home;
        }

        const dateStr = `${home.date}, ${home.hour12}`;
        const newDate = addMinutes(
          new Date(dateStr),
          (tz.offset - home.offset) * 60
        );

        tz.date = format(newDate, "eee, MMM d, y");
        tz.timeDials = getTimeDials(tz, dialColor, home);

        return tz;
      });

      return newTimezones;
    });
  }, [selectedDate]);

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
          return {
            ...td,
            dailyCircleBgColor: getDailyCircleBgColor(
              td.hour24,
              dialColor,
              td.isNewDay
            ),
          };
        });

        return { ...tz, timeDials };
      });
    });
  }, [dialColor]);

  return [selectedTimezones, setSelectedTimezones];
}
