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
import {
  getNextDay,
  formatCurrentDate,
  currentTime,
  getLocalTime,
} from "~/utils/timezones";
import { MILISECONDS_PER_MIN } from "~/constants/index";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { differenceInDays } from "date-fns";

export function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<ITimezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, []);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const prevdiffDatesFromLocalTimeRef = useRef(0);

  const diffDatesFromLocalTime = differenceInDays(
    new Date(selectedDate),
    new Date(getLocalTime())
  );

  useEffect(() => {
    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((prevTimezone) => {
        const currentDate = formatCurrentDate(prevTimezone, [
          "dayOfWeek",
          "monthAndDay",
          "year",
        ]);

        const [dayOfWeek, monthAndDay] = getNextDay(
          currentDate,
          diffDatesFromLocalTime - prevdiffDatesFromLocalTimeRef.current
        ).split(", ");

        return { ...prevTimezone, dayOfWeek, monthAndDay };
      });

      prevdiffDatesFromLocalTimeRef.current = diffDatesFromLocalTime;

      return newTimezones;
    });
  }, [selectedDate]);

  useEffect(() => {
    setTimezonesClockCb((preTimezones) => {
      return preTimezones.map((preTz) => {
        return {
          ...preTz,
          clock: currentTime(preTz.name, hoursFormat),
        };
      });
    });
  }, [hoursFormat, setTimezonesClockCb]);

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;
    const intervalId = setInterval(() => {
      setTimezonesClockCb((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          clock: currentTime(tz.name),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, []);
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
