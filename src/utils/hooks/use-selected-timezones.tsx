import {
  SetStateAction,
  Dispatch,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";

import { currentDateAtom } from "~/atoms/date";
import { getNextDay, formatCurrentTime, currentTime } from "~/utils/timezones";
import { MILISECONDS_PER_MIN } from "~/constants/index";
import { hoursFormatAtom } from "~/atoms/hours-format";

export function useUpdateTimezonesClock(
  setTimezonesClock: Dispatch<SetStateAction<ITimezone[]>>
): void {
  const setTimezonesClockCb = useCallback(setTimezonesClock, []);
  const [currentDate] = useAtom(currentDateAtom);
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const prevDateIndexRef = useRef(0);

  useEffect(() => {
    setTimezonesClockCb((prevTimezones) => {
      const newTimezones = prevTimezones.map((prevTimezone) => {
        const t = formatCurrentTime(prevTimezone, [
          "dayOfWeek",
          "monthAndDay",
          "year",
        ]);
        const dateCounts = currentDate.dateIndex - prevDateIndexRef.current;
        const [dayOfWeek, monthAndDay] = getNextDay(t, dateCounts).split(", ");

        return { ...prevTimezone, dayOfWeek, monthAndDay };
      });
      prevDateIndexRef.current = currentDate.dateIndex;
      return newTimezones;
    });
  }, [currentDate]);

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
