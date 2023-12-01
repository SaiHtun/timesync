import { useState, useMemo } from "react";
import Timezones from "./timezones";
import { type NormalisedTimezone } from "~/utils/timezones";
import { useTimezones } from "~/utils/hooks/use-timezones";
import Fuse from "fuse.js";
import { getCurrentUserTimezoneName } from "~/utils/current-time";
import Navbar from "./navbar";
import { useDebounce } from "~/utils/hooks/use-debounce";

export default function TimezonesBoard() {
  const [timezones] = useTimezones();
  const [selectedTimezones, setSelectedTimezones] = useTimezones(
    timezones.filter((tz) => tz.name === getCurrentUserTimezoneName())
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectTimezoneIndex, setSelectTimezoneIndex] = useState(0);

  let filteredTimezones = useMemo(
    () =>
      new Fuse(timezones, {
        keys: ["name"],
      })
        .search(debouncedSearch)
        .map((tz) => tz.item)
        .slice(0, 10),
    [debouncedSearch, timezones]
  );

  function addToSelectedTimezones(timezone: NormalisedTimezone): void {
    setSelectedTimezones((tzs) => tzs.concat(timezone));
    setSearch("");
    setSelectTimezoneIndex(0);
  }

  function handleKeySelectTimezone(e: React.KeyboardEvent) {
    if (!debouncedSearch) return;
    const tzLength = filteredTimezones.length;
    // normalised index, it will always within the range
    if (e.code === "ArrowDown") {
      setSelectTimezoneIndex((tzIndex) => {
        return (tzIndex + 1) % tzLength;
      });
    } else if (e.code === "ArrowUp") {
      setSelectTimezoneIndex((tzIndex) => {
        return (tzIndex - 1 + tzLength) % tzLength;
        // can do this as well
        // return tz - 1 < 0 ? tzLength - 1 : tz - 1;
      });
    } else if (e.code === "Enter") {
      addToSelectedTimezones(filteredTimezones[selectTimezoneIndex]);
    }
  }
  return (
    <main onKeyDown={handleKeySelectTimezone}>
      <Navbar />
      <div className="mt-14 flex flex-col gap-4">
        <div className="grid grid-cols-[300px_minmax(600px,_1fr)] gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search.."
            className="p-2 border rounded-sm bg-transparent text-sm pl-4"
          />
          <div className="bg-gray-100 rounded-sm"></div>
        </div>
        {debouncedSearch ? (
          <Timezones
            timezones={filteredTimezones}
            addToSelectedTimezones={addToSelectedTimezones}
            setSelectTimezoneIndex={setSelectTimezoneIndex}
          />
        ) : (
          <Timezones timezones={selectedTimezones} />
        )}
      </div>
    </main>
  );
}
