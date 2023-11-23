import { useState, useMemo } from "react";
import Timezones from "./timezones";
import timezones, { NormalisedTimezone } from "~/utils/timezones";
import { switchTheme } from "~/utils/switch-theme";
import Fuse, { FuseResult } from "fuse.js";

export default function TimezonesBoard() {
  const [search, setSearch] = useState("");
  const [selectedTimezones, setSelectedTimezones] = useState<
    FuseResult<NormalisedTimezone>[]
  >([]);
  const [selectTimezoneIndex, setSelectTimezoneIndex] = useState(0);

  const fuse = new Fuse(timezones, {
    keys: ["name"],
  });

  let filteredTimezones = useMemo(() => fuse.search(search), [search]);

  function handleSelectTimezone(e: React.KeyboardEvent) {
    if (!search) return;
    const tzLength = filteredTimezones.length;
    if (e.code === "ArrowDown") {
      setSelectTimezoneIndex((tz) => {
        return (tz + 1) % tzLength;
      });
    } else if (e.code === "ArrowUp") {
      setSelectTimezoneIndex((tz) => {
        return tz - 1 < 0 ? tzLength - 1 : tz - 1;
      });
    } else if (e.code === "Enter") {
      setSelectedTimezones((tzs) =>
        tzs.concat(filteredTimezones[selectTimezoneIndex])
      );

      setSearch("");
    }
  }

  return (
    <main onKeyDown={handleSelectTimezone}>
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
        className="p-2 border border-indigo-600 rounded-md w-full dark:bg-gray-700 text-sm pl-2"
      />
      <Timezones
        timezones={filteredTimezones}
        selectTimezoneIndex={selectTimezoneIndex}
      />
      {!search && (
        <Timezones timezones={selectedTimezones} isSelectedTimezones={true} />
      )}
    </main>
  );
}
