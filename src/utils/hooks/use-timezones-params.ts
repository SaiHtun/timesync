import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { jsonParser } from "../index";
import { getCurrentUserTimezoneName } from "~/utils/timezones";
import { useEffect, useState } from "react";

function arrangeHomeFirstParams(
  timezonesName: string[],
  setSearchParams: SetURLSearchParams
) {
  const currentTimezoneName = getCurrentUserTimezoneName();
  const firstTimezoneName = timezonesName[0];
  if (
    !timezonesName.includes(currentTimezoneName) ||
    currentTimezoneName === firstTimezoneName
  )
    return timezonesName;

  const homeIndex = timezonesName.indexOf(currentTimezoneName);
  [timezonesName[0], timezonesName[homeIndex]] = [
    timezonesName[homeIndex],
    firstTimezoneName,
  ];

  setSearchParams({ timezones: JSON.stringify(timezonesName) });

  return timezonesName;
}

export function useTimezonesParams(): string[] {
  const KEY = "timezones";
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const searchValues = searchParams.get(KEY) as string;
    const defaultValue = [getCurrentUserTimezoneName()];
    if (!searchValues) {
      setSearchParams({ [KEY]: JSON.stringify(defaultValue) });
      setData(defaultValue);
      // console.warn(`Couldn't get a value from URL using this key: ${KEY}`);
    } else {
      const { err, data: parsedTimezones } = jsonParser<string[]>(searchValues);
      if (err !== null) {
        console.error(`Error parsing the value of key: ${KEY}`);
        setData(defaultValue);
      } else {
        const d =
          parsedTimezones.length > 1
            ? arrangeHomeFirstParams(parsedTimezones, setSearchParams)
            : parsedTimezones;

        setData(d);
      }
    }
  }, []);

  return data;
}

export function appendTimezoneNameToUrl(
  timezoneName: string,
  [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams]
) {
  const timezones = searchParams.get("timezones") || "[]";

  const { err, data: parsedTimezones } = jsonParser<string[]>(timezones);

  if (err === null) {
    // limit appending to URL. Thus, will also limit adding "SelectedTimezones"
    if (
      parsedTimezones.length < 10 &&
      !parsedTimezones.includes(timezoneName)
    ) {
      parsedTimezones.push(timezoneName);
    }
    setSearchParams((prevParams) => {
      prevParams.set("timezones", JSON.stringify(parsedTimezones));
      return prevParams;
    });
  }
}

export function popTimezoneNameFromUrl(
  timezoneName: string,
  [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams]
) {
  const timezones = searchParams.get("timezones") || "[]";

  const { err, data: parsedTimezones } = jsonParser<string[]>(timezones);

  if (err === null) {
    // limit appending to URL. Thus, will also limit adding "SelectedTimezones"
    const filteredTimezones = parsedTimezones.filter(
      (tz) => tz !== timezoneName
    );

    setSearchParams((prevParams) => {
      prevParams.set("timezones", JSON.stringify(filteredTimezones));
      return prevParams;
    });
  }
}
// check if "arrangeHomePramsFirst" and "diffHoursFromHome" works!
// [check_one] http://localhost:5173/?timezones=%5B%22Asia%2FShanghai%22%2C%22America%2FLos_Angeles%22%5D
// [check_two] http://localhost:5173/?timezones=%5B%22Asia%2FRangoon%22%2C%22Asia%2FShanghai%22%2C%22America%2FDenver%22%2C%22America%2FNew_York%22%2C%22America%2FLos_Angeles%22%5D
