import SelectedTimezones from "~/components/SelectedTimezones";
import SearchdTimezonesModel from "./SearchedTimezonesModel";
import { useAtom } from "jotai";
import { handleKeydownSearchedTimezoneAtom } from "~/atoms/searched-timezones";
import MenuBar from "./MenuBar";

export default function TimezonesBoard() {
  const [, handleKeydownSearchedTimezone] = useAtom(
    handleKeydownSearchedTimezoneAtom
  );

  return (
    <main
      className="min-h-[500px] w-[1148px] mx-auto relative"
      onKeyDown={(e) => handleKeydownSearchedTimezone({ e })}
    >
      <MenuBar />
      <SelectedTimezones />
      <SearchdTimezonesModel />
    </main>
  );
}
