import { useSearchedTimezones } from "~/utils/hooks/use-searched-timezones";
import SearchedTimezoneRow from "./SearchedTimezoneRow";

export default function SearchedTimezones() {
  const searchedTimezones = useSearchedTimezones();

  return (
    <div
      id="searched-timezones"
      className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute top-0 right-0 shadow-md rounded-md"
    >
      {searchedTimezones.map((tz, index) => {
        return (
          <SearchedTimezoneRow
            key={tz.name}
            timezone={tz}
            currentTimezoneIndex={index}
          />
        );
      })}
    </div>
  );
}
