import SelectedTimezones from "~/components/SelectedTimezones";
import Navbar from "./NavBar";
import SearchdTimezonesModel from "./SearchedTimezonesModel";
import MenuBar from "./MenuBar";
import { useAtom } from "jotai";
import { handleKeydownSearchedTimezoneAtom } from "~/atoms/searched-timezones";
import { useSearchParams } from "react-router-dom";

export default function TimezonesBoard() {
  const [, handleKeydownSearchedTimezone] = useAtom(
    handleKeydownSearchedTimezoneAtom
  );
  const useSearchParamsItems = useSearchParams();

  return (
    <div
      onKeyDown={(e) =>
        handleKeydownSearchedTimezone({ e, useSearchParamsItems })
      }
    >
      <Navbar />
      <MenuBar />
      <main className="relative w-full mt-4">
        <SelectedTimezones />
        <SearchdTimezonesModel />
      </main>
    </div>
  );
}
