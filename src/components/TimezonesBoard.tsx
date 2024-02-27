import SelectedTimezones from "~/components/SelectedTimezones";
import SearchdTimezonesModel from "./SearchedTimezonesModel";
import { useAtom } from "jotai";
import { handleKeydownSearchedTimezoneAtom } from "~/atoms/searched-timezones";
import MenuBar from "./MenuBar";
import TimezonesCountStats from "./TimezonesCountStats";

export default function TimezonesBoard() {
  const [, handleKeydownSearchedTimezone] = useAtom(
    handleKeydownSearchedTimezoneAtom
  );

  return (
    <main
      className="min-h-[500px] w-[1148px] mx-auto relative flex flex-col"
      onKeyDown={(e) => handleKeydownSearchedTimezone({ e })}
    >
      <MenuBar />
      <SelectedTimezones />
      <SearchdTimezonesModel />
      {/* hacky way to have sticky footer */}
      <div className="mb-auto"></div>
      <TimezonesCountStats />
    </main>
  );
}
