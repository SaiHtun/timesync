import { useState, useMemo, useDeferredValue } from "react";
import Timezones from "~/components/timezones";
import {
  useTimezones,
  type Timezone,
  useTimezoneFormat,
} from "~/utils/hooks/use-timezones";
import Fuse from "fuse.js";
import { getCurrentUserTimezoneName } from "~/utils/hooks/use-timezones";
import Navbar from "./navbar";
import SearchTimezones from "~/components/searched-timezones";
import { cn } from "~/utils/cn";
import { useSearchParams } from "react-router-dom";

export default function TimezonesBoard() {
  const [timezoneFormat, toggleTimezoneFormat] = useTimezoneFormat();
  const [timezones] = useTimezones();
  const [searchParams, setSearchParams] = useSearchParams();

  // should seperate it!
  const [selectedTimezones, setSelectedTimezones] = useTimezones(
    timezones.filter((tz) => tz.name === getCurrentUserTimezoneName())
  );

  const [search, setSearch] = useState("");
  let deferredSearch = useDeferredValue(search);
  const [selectedTimezoneIndex, setSelectedTimezoneIndex] = useState(0);
  const filteredTimezones = useMemo(
    () =>
      new Fuse(timezones, {
        keys: ["name"],
      })
        .search(deferredSearch)
        .map((tz) => tz.item)
        .slice(0, 10),
    [deferredSearch, timezones, timezoneFormat]
  );

  function resetStates() {
    setSearch("");
    setSelectedTimezoneIndex(0);
  }

  function paramsParser(params: string) {
    try {
      return JSON.parse(params);
    } catch (e) {
      if (e instanceof Error) {
        console.error("MeError::", e.message);
      }
    }
  }

  function isValidTimezones(tzsNames: string[]) {
    return (
      Array.isArray(tzsNames) &&
      tzsNames.every((tzName) =>
        Intl.supportedValuesOf("timeZone").includes(tzName)
      )
    );
  }

  function mergedSearchParams(existingTimezones: string, newTimezone: string) {
    const parsedData = paramsParser(existingTimezones);
    if (isValidTimezones(parsedData) && isValidTimezones([newTimezone])) {
      setSearchParams({
        tzs: JSON.stringify([...parsedData, newTimezone]),
      });
    }
  }

  function addToSelectedTimezones(timezone: Timezone): void {
    const isExist =
      selectedTimezones.some((tz) => tz.name === timezone.name) ||
      selectedTimezones.length > 9;

    if (!isExist) {
      setSelectedTimezones((tzs) => tzs.concat(timezone));
      mergedSearchParams(searchParams.get("tzs") || "[]", timezone.name);
    }

    resetStates();
  }

  function handleKeySelectTimezone(e: React.KeyboardEvent) {
    if (!deferredSearch) return;
    const tzLength = filteredTimezones.length;
    // normalised index, it will always within the range
    if (e.code === "ArrowDown") {
      setSelectedTimezoneIndex((tzIndex) => {
        return (tzIndex + 1) % tzLength;
      });
    } else if (e.code === "ArrowUp") {
      setSelectedTimezoneIndex((tzIndex) => {
        return (tzIndex - 1 + tzLength) % tzLength;
        // can do this as well
        // return tz - 1 < 0 ? tzLength - 1 : tz - 1;
      });
    } else if (e.code === "Enter") {
      addToSelectedTimezones(filteredTimezones[selectedTimezoneIndex]);
    } else if (e.code === "Escape") {
      resetStates();
    }
  }

  return (
    <main onKeyDown={handleKeySelectTimezone} className="w-full h-full">
      <Navbar />
      <div className="mt-12 flex flex-col gap-4">
        <div className="h-12 grid grid-cols-[1fr_300px] gap-2">
          <div className="primary_bg primary_border rounded-md px-2 flex items-center ">
            <button
              type="button"
              className="p-2 text-xs space-x-1 primary_border rounded-md transition-all"
              onClick={toggleTimezoneFormat}
            >
              <span
                className={cn("dark:text-white text-zinc-900", {
                  "text-zinc-400 dark:text-zinc-400": timezoneFormat !== "h23",
                })}
              >
                24
              </span>
              <span>/</span>
              <span
                className={cn("dark:text-white text-zinc-900", {
                  "text-zinc-400 dark:text-zinc-400": timezoneFormat !== "h12",
                })}
              >
                {12}
              </span>
            </button>
          </div>
          <input
            type="text"
            value={search}
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Place or Timezone  🔍"
            className="p-2 rounded-md text-sm pl-4 focus:outline-none primary_bg primary_border placeholder:text-xs"
          />
        </div>
        <div className="relative w-full">
          <Timezones
            timezones={selectedTimezones}
            timezoneFormat={timezoneFormat}
          />
          <SearchTimezones
            selectedTimezoneIndex={selectedTimezoneIndex}
            timezones={filteredTimezones}
            addToSelectedTimezones={addToSelectedTimezones}
            timezoneFormat={timezoneFormat}
            setSelectedTimezoneIndex={setSelectedTimezoneIndex}
          />
        </div>
      </div>
    </main>
  );
}
