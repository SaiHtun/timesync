import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsonParser } from "../index";
import { getCurrentUserTimezoneName } from "./use-timezones";

function arrangeHomeFirstParams(timezonesName: string[]) {
  const currentTimezoneName = getCurrentUserTimezoneName();
  const firstTimezoneName = timezonesName[0];

  if (currentTimezoneName === firstTimezoneName) return timezonesName;

  const homeIndex = timezonesName.indexOf(currentTimezoneName);
  [timezonesName[0], timezonesName[homeIndex]] = [
    timezonesName[homeIndex],
    firstTimezoneName,
  ];

  return timezonesName;
}

export function useTimezonesParams(
  key: string,
  timezonesName: string[]
): string[] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const paramsValue = searchParams.get(key);

    let updatedParams: Record<string, string> = {};
    if (!paramsValue) {
      updatedParams = { [key]: JSON.stringify(timezonesName) };
    } else {
      const { err, data } = jsonParser<string[]>(paramsValue);

      if (err === null) {
        updatedParams = {
          [key]: JSON.stringify(arrangeHomeFirstParams(data)),
        };
        setData(data);
      }
    }
    setSearchParams(updatedParams);
  }, [searchParams]);

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
    setSearchParams({ timezones: JSON.stringify(parsedTimezones) });
  }
}

// check if "arrangeHomePramsFirst" and "diffHoursFromHome" works!
// [check_one] http://localhost:5173/?timezones=%5B%22Asia%2FShanghai%22%2C%22America%2FLos_Angeles%22%5D
// [check_two] http://localhost:5173/?timezones=%5B%22Asia%2FRangoon%22%2C%22Asia%2FShanghai%22%2C%22America%2FDenver%22%2C%22America%2FNew_York%22%2C%22America%2FLos_Angeles%22%5D
