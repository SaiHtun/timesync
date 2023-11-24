import { useState, useMemo } from "react";
import Timezones from "./timezones";
import { type NormalisedTimezone, useTimezones } from "~/utils/timezones";
import { switchTheme } from "~/utils/switch-theme";
import Fuse from "fuse.js";
import { getCurrentUserTimezoneName } from "~/utils/current-time";

export default function TimezonesBoard() {
  const [timezones] = useTimezones();
  const [selectedTimezones, setSelectedTimezones] = useTimezones(
    timezones.filter((tz) => tz.name === getCurrentUserTimezoneName())
  );
  const [search, setSearch] = useState("");
  const [selectTimezoneIndex, setSelectTimezoneIndex] = useState(0);
  const fuse = new Fuse(timezones, {
    keys: ["name"],
  });

  let filteredTimezones = useMemo(
    () => fuse.search(search).map((tz) => tz.item),
    [search, timezones]
  );

  function addToSelectedTimezones(timezone: NormalisedTimezone): void {
    setSelectedTimezones((tzs) => tzs.concat(timezone));

    setSearch("");
    setSelectTimezoneIndex(0);
  }

  function useKeySelectTimezone(e: React.KeyboardEvent) {
    if (!search) return;
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
    <main onKeyDown={useKeySelectTimezone}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-center text-2xl font-bold text-indigo-600">
          WootTime
        </h1>
        <button
          onClick={switchTheme}
          className="border border-indigo-600 hover:border-indigo-500 px-2 py-1 rounded-md text-sm font-bold text-indigo-600 hover:text-indigo-400"
        >
          Theme
        </button>
      </div>
      <input
        type="text"
        value={search}
        placeholder="search.."
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-indigo-600 rounded-md w-full bg-transparent text-sm pl-4"
      />
      <Timezones
        timezones={filteredTimezones}
        selectTimezoneIndex={selectTimezoneIndex}
        addToSelectedTimezones={addToSelectedTimezones}
        isSelectedTimezones={true}
        setSelectTimezoneIndex={setSelectTimezoneIndex}
      />
      {!search && <Timezones timezones={selectedTimezones} />}
    </main>
  );
}
