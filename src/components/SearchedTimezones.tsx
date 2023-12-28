import { useSearchedTimezones } from "~/utils/hooks/use-timezones";
import SearchedTimezoneRow from "./SearchedTimezoneRow";
import { useAtom } from "jotai";
import { searchedTimezoneIndexAtom } from "~/atoms/searched-timezone-index";

export default function SearchedTimezones() {
  const searchedTimezones = useSearchedTimezones();
  const [searchedTimezoneIndex] = useAtom(searchedTimezoneIndexAtom);

  return (
    <div
      id="searched-timezones"
      className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute right-0 shadow-md rounded-md"
    >
      {searchedTimezones.map((tz, index) => {
        const isSelected = searchedTimezoneIndex === index;
        return (
          <SearchedTimezoneRow
            key={tz.name}
            timezone={tz}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}
