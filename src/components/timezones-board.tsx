import { useState, useMemo, useDeferredValue } from "react";
import Timezones from "~/components/timezones";
import { useTimezones, type Timezone } from "~/utils/hooks/use-timezones";
import Fuse from "fuse.js";
import { getCurrentUserTimezoneName } from "~/utils/hooks/use-timezones";
import Navbar from "./nav-bar";
import SearchTimezones from "~/components/searched-timezones";
import { useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import MenuBar from "./menu-bar";
import { searchTimezoneAtom } from "~/atoms/search-timezone";

export default function TimezonesBoard() {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [timezones] = useTimezones(hoursFormat);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTimezone, setSearchTimezone] = useAtom(searchTimezoneAtom);
  // should seperate it!
  const [selectedTimezones, setSelectedTimezones] = useTimezones(
    hoursFormat,
    timezones.filter((tz) => tz.name === getCurrentUserTimezoneName())
  );

  let deferredSearch = useDeferredValue(searchTimezone);
  const [selectedTimezoneIndex, setSelectedTimezoneIndex] = useState(0);
  const filteredTimezones = useMemo(
    () =>
      new Fuse(timezones, {
        keys: ["name"],
      })
        .search(deferredSearch)
        .map((tz) => tz.item)
        .slice(0, 10),
    [deferredSearch, timezones, hoursFormat]
  );

  function resetStates() {
    setSearchTimezone("");
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
      <MenuBar />
      <div className="relative w-full mt-4">
        <Timezones timezones={selectedTimezones} />
        <SearchTimezones
          selectedTimezoneIndex={selectedTimezoneIndex}
          timezones={filteredTimezones}
          addToSelectedTimezones={addToSelectedTimezones}
          setSelectedTimezoneIndex={setSelectedTimezoneIndex}
        />
      </div>
    </main>
  );
}
