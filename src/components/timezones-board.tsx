import { useState, useMemo, useDeferredValue } from "react";
import Timezones from "./timezones";
import { type NormalisedTimezone } from "~/utils/timezones";
import { useTimezones } from "~/utils/hooks/use-timezones";
import Fuse from "fuse.js";
import { getCurrentUserTimezoneName } from "~/utils/current-time";
import Navbar from "./navbar";
import SearchTimezones from "./searched-timezones";

export default function TimezonesBoard() {
  const [timezones] = useTimezones();
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
    [deferredSearch, timezones]
  );

  function resetStates() {
    setSearch("");
    setSelectedTimezoneIndex(0);
  }

  function addToSelectedTimezones(timezone: NormalisedTimezone): void {
    setSelectedTimezones((tzs) =>
      tzs.find((tz) => tz.id === timezone.id) || tzs.length > 9
        ? tzs
        : tzs.concat(timezone)
    );

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
      <div className="mt-14 flex flex-col gap-4">
        <div className="grid grid-cols-[300px_1fr] gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search.."
            className="p-2 border rounded-sm dark:border-zinc-800 bg-transparent text-sm pl-4 focus:outline-none "
          />
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-sm"></div>
        </div>
        <div className="relative w-full">
          <Timezones timezones={selectedTimezones} />
          <SearchTimezones
            selectedTimezoneIndex={selectedTimezoneIndex}
            timezones={filteredTimezones}
            addToSelectedTimezones={addToSelectedTimezones}
          />
        </div>
      </div>
    </main>
  );
}
