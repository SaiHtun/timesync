import { SetStateAction, Dispatch, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";

import { selectedDateAtom } from "~/atoms/date";
import {
  currentTime,
  getDailyCircleColor,
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

  useEffect(() => {
    let home = {} as ITimezone;
    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((tz, index) => {
        if (index === 0) {
          tz.date = selectedDate.date;
          tz.timeDials = tz.timeDials.map((td) => {
            const hours = td.date.split(", ").pop();
            const newDate = `${tz.date}, ${hours}`;

            return { ...td, date: newDate };
          });
          home = tz;
          return tz;
        }

        const dateStr = `${home.date}, ${home.hour12}`;

        tz.date = formatInTimeZone(new Date(dateStr), tz.name, "eee, MMM d, y");
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
            dailyCircleBgColor: getDailyCircleColor(
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
