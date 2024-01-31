import {
  SetStateAction,
  Dispatch,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";

import { selectedDateAtom } from "~/atoms/date";
import { getNextDay, currentTime, getLocalTime } from "~/utils/timezones";
import { MILISECONDS_PER_MIN } from "~/constants/index";
import { differenceInDays } from "date-fns";

export function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<ITimezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, [
    setTimezonesClock,
  ]);
  const [selectedDate] = useAtom(selectedDateAtom);
  const prevdiffDatesFromLocalTimeRef = useRef(0);

  const diffDatesFromLocalTime = differenceInDays(
    new Date(selectedDate),
    new Date(getLocalTime())
  );

  useEffect(() => {
    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((prevTimezone) => {
        const currentDate = getNextDay(
          prevTimezone.currentDate,
          diffDatesFromLocalTime - prevdiffDatesFromLocalTimeRef.current
        );

        return { ...prevTimezone, currentDate };
      });

      prevdiffDatesFromLocalTimeRef.current = diffDatesFromLocalTime;

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

  useUpdateTimezonesClock(setSelectedTimezones);

  return [selectedTimezones, setSelectedTimezones];
}
