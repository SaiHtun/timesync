import { SetStateAction, useState, useEffect } from "react";
import { currentTime } from "../current-time";
import { NormalisedTimezone, normalisedTimezones } from "~/utils/timezones";

type UseTimezonesReturnType = [
  NormalisedTimezone[],
  React.Dispatch<SetStateAction<NormalisedTimezone[]>>
];

const MILISECONDS_PER_MIN = 60_000;

export function useTimezones(
  initTimezones?: NormalisedTimezone[]
): UseTimezonesReturnType {
  const [timezones, setTimezones] = useState(
    () => initTimezones || normalisedTimezones()
  );

  useEffect(() => {
    const requiredIntervalToBeAMinute =
      MILISECONDS_PER_MIN - new Date().getSeconds() * 1_000;

    const intervalId = setInterval(() => {
      setTimezones((tzs) =>
        tzs.map((tz) => ({
          ...tz,
          now: currentTime(tz.name),
        }))
      );
    }, requiredIntervalToBeAMinute);

    return () => clearInterval(intervalId);
  }, [timezones]);

  return [timezones, setTimezones];
}
