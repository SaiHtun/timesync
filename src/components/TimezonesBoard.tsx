import SelectedTimezones from "~/components/SelectedTimezones";
import Navbar from "./NavBar";
import SearchdTimezonesModel from "./SearchedTimezonesModel";
import MenuBar from "./MenuBar";
import { useAtom } from "jotai";
import { handleKeydownSearchedTimezoneAtom } from "~/atoms/searched-timezones";

export default function TimezonesBoard() {
  const [, handleKeydownSearchedTimezone] = useAtom(
    handleKeydownSearchedTimezoneAtom
  );

  return (
    <div onKeyDown={(e) => handleKeydownSearchedTimezone({ e })}>
      <Navbar />
      <MenuBar />
      <main className="relative w-full mt-6">
        <SelectedTimezones />
        <SearchdTimezonesModel />
      </main>
    </div>
  );
}
