import { useAtom } from "jotai";
import { hoursFormatAtom, toggleHoursFormatAtom } from "~/atoms/hours-format";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import { cn } from "~/utils/cn";

export default function MenuBar() {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [, toggleHoursFormat] = useAtom(toggleHoursFormatAtom);
  const [searchTimezoneName, setSearchTimezone] = useAtom(
    searchTimezoneNameAtom
  );

  return (
    <div className="mt-12 flex flex-col gap-4">
      <div className="h-12 grid grid-cols-[1fr_300px] gap-2">
        <div className="primary_bg primary_border rounded-md px-2 flex items-center ">
          <button
            id="hoursFormat-btn"
            type="button"
            className="p-2 text-xs space-x-1 primary_border rounded-md transition-all"
            onClick={toggleHoursFormat}
          >
            <span
              className={cn("dark:text-white text-zinc-900", {
                "text-zinc-400 dark:text-zinc-400": hoursFormat !== "24",
              })}
            >
              24
            </span>
            <span>/</span>
            <span
              className={cn("dark:text-white text-zinc-900", {
                "text-zinc-400 dark:text-zinc-400": hoursFormat !== "12",
              })}
            >
              {12}
            </span>
          </button>
        </div>
        <input
          type="text"
          value={searchTimezoneName}
          name="search"
          onChange={(e) => setSearchTimezone(e.target.value)}
          placeholder="Place or Timezone  🔍"
          className="p-2 rounded-md text-sm pl-4 focus:outline-none primary_bg primary_border placeholder:text-xs"
        />
      </div>
    </div>
  );
}
