import { useAtom } from "jotai";
import TimezonesBoard from "./components/timezones-board";
import { searchTimezoneAtom } from "./atoms/search-timezone";

function App() {
  const [, setSearchTimezone] = useAtom(searchTimezoneAtom);

  function handleClickReset(e: React.MouseEvent<HTMLDivElement>) {
    if (e.currentTarget.id !== "searched-timezones") {
      setSearchTimezone("");
    }
  }

  return (
    <div
      className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-20 overflow-scroll"
      onClick={handleClickReset}
    >
      <main className="max-sm:px-4 max-sm:w-[1120px] w-[1100px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
