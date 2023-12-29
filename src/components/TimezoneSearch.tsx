import { useAtom } from "jotai";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";

export default function TimezoneSearch() {
  const [searchTimezoneName, setSearchTimezone] = useAtom(
    searchTimezoneNameAtom
  );
  return (
    <input
      type="text"
      value={searchTimezoneName}
      name="search"
      onChange={(e) => setSearchTimezone(e.target.value)}
      placeholder="Place or Timezone  🔍"
      className="p-2 rounded-md text-sm pl-4 focus:outline-none primary_bg primary_border placeholder:text-xs"
    />
  );
}
