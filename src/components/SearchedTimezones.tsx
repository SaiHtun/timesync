import { useSearchedTimezones } from "~/utils/hooks/use-timezones";
import SearchedTimezoneRow from "./SearchedTimezoneRow";

export default function SearchedTimezones() {
  const searchedTimezones = useSearchedTimezones();

  return (
    <div className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute right-0 shadow-md rounded-md">
      {searchedTimezones.map((tz) => (
        <SearchedTimezoneRow key={tz.name} timezone={tz} />
      ))}
    </div>
  );
}
