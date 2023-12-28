import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsonParser } from "../index";

export function useParams<T>(key: string, value: T): T | undefined {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    if (!searchParams.get(key)) {
      setSearchParams((pre) => {
        pre.append(key, JSON.stringify(value));
        return pre;
      });
    }
    const { err, data } = jsonParser<T>(searchParams.get(key)!);
    if (err !== null) {
      setSearchParams((pre) => {
        pre.set(key, JSON.stringify(value));
        return pre;
      });
    } else {
      setData(data);
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
    if (!parsedTimezones.includes(timezoneName)) {
      parsedTimezones.push(timezoneName);
      setSearchParams({ timezones: JSON.stringify(parsedTimezones) });
    }
  }
}
