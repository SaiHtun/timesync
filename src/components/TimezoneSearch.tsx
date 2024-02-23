import { useAtom } from "jotai";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import { Search } from "lucide-react";
import { shouldDisabledFeaturesAtom } from "~/atoms/selected-timezones";
import { cn } from "~/utils/cn";

export default function TimezoneSearch() {
  const [searchTimezoneName, setSearchTimezone] = useAtom(
    searchTimezoneNameAtom
  );
  const [shouldDisabledSearch] = useAtom(shouldDisabledFeaturesAtom);

  return (
    <div className="relative h-full top-0 right-0">
      <input
        type="text"
        value={searchTimezoneName}
        name="search"
        disabled={shouldDisabledSearch}
        onChange={(e) => setSearchTimezone(e.target.value)}
        placeholder="City or Timezone"
        className={cn(
          "p-2 h-full w-full rounded-md text-sm pl-4 focus:outline-none primary_bg primary_border placeholder:text-xs",
          {
            "cursor-not-allowed": shouldDisabledSearch,
          }
        )}
      />
      {!searchTimezoneName && (
        <Search
          strokeWidth={1}
          size={20}
          className="absolute right-4 top-[50%] translate-y-[-50%] primary_text_gray"
        />
      )}
    </div>
  );
}
