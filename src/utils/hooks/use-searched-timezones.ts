import { useDeferredValue, useEffect, useMemo } from "react";
import { useUpdateTimezonesClock } from "./use-selected-timezones";
import { useAtom } from "jotai";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import Fuse from "fuse.js";
import { searchedTimezonesAtom } from "~/atoms/searched-timezones";
import { populateTimezones } from "~/utils/timezones";

export function useSearchedTimezones(): ITimezone[] {
  const timezones = useMemo(() => populateTimezones(), []);
  const [searchTimezoneName] = useAtom(searchTimezoneNameAtom);

  const deferredSearch = useDeferredValue(searchTimezoneName);
  const [filteredTimezones, setFilteredTimezones] = useAtom(
    searchedTimezonesAtom
  );

  useEffect(() => {
    const fusedTimezones = new Fuse(timezones, {
      keys: ["name", "abbr"],
    })
      .search(deferredSearch)
      .map((tz) => tz.item)
      .slice(0, 10);

    setFilteredTimezones(fusedTimezones);
  }, [deferredSearch, timezones]);

  useUpdateTimezonesClock(setFilteredTimezones);

  return filteredTimezones;
}
