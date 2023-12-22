import { useTimezones } from "~/utils/hooks/use-timezones";
import SearchedTimezoneRow from "./SearchedTimezoneRow";
import Fuse from "fuse.js";
import { useDeferredValue, useState, useMemo } from "react";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { searchTimezoneAtom } from "~/atoms/search-timezone";
import { addSelectedTimezonesAtom } from "~/atoms/selected-timezones";

export default function SearchedTimezones() {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [timezones] = useTimezones(hoursFormat);
  const [searchTimezone, setSearchTimezone] = useAtom(searchTimezoneAtom);
  const [, addSelectedTimezones] = useAtom(addSelectedTimezonesAtom);

  let deferredSearch = useDeferredValue(searchTimezone);
  const [selectedTimezoneIndex, setSelectedTimezoneIndex] = useState(0);
  const filteredTimezones = useMemo(
    () =>
      new Fuse(timezones, {
        keys: ["name", "abbr"],
      })
        .search(deferredSearch)
        .map((tz) => tz.item)
        .slice(0, 10),
    [deferredSearch, timezones, hoursFormat]
  );

  function handleKeySelectTimezone(e: React.KeyboardEvent) {
    if (!deferredSearch) return;
    console.log(e.code);
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
      addSelectedTimezones(filteredTimezones[selectedTimezoneIndex]);
    } else if (e.code === "Escape") {
      console.log("zz");
      setSearchTimezone("");
    }
  }

  return (
    <div
      onKeyDown={handleKeySelectTimezone}
      className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute right-0 shadow-md rounded-md"
    >
      {filteredTimezones.map((tz, index) => (
        <SearchedTimezoneRow
          key={tz.name}
          rowIndex={index}
          setSelectedTimezoneIndex={setSelectedTimezoneIndex}
          timezone={tz}
          isSelected={timezones[selectedTimezoneIndex].name === tz.name}
        />
      ))}
    </div>
  );
}
