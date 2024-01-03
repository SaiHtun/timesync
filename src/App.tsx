import TimezonesBoard from "./components/TimezonesBoard";
import { useAtom } from "jotai";
import { syncUrlToSelectedTimezonesAtom } from "./atoms/selected-timezones";
import { useEffect } from "react";
import { getCurrentUserTimezoneName } from "./utils/hooks/use-timezones";
import { useTimezonesParams } from "~/utils/hooks/use-params";
import { useEventListener } from "./utils/hooks/use-event-listener";
import { searchTimezoneNameAtom } from "./atoms/search-timezone-name";

function App() {
  const timezonesName = useTimezonesParams("timezones", [
    getCurrentUserTimezoneName(),
  ]);
  const [, setSearchTimezoneName] = useAtom(searchTimezoneNameAtom);
  const [, syncUrlToSelectedTimezones] = useAtom(
    syncUrlToSelectedTimezonesAtom
  );

  useEffect(() => {
    syncUrlToSelectedTimezones(timezonesName);
  }, [timezonesName, syncUrlToSelectedTimezones]);

  function dismissSearchedTimezonesOnOuterClick(e: MouseEvent) {
    const hoursFormatBtn = (e.target as HTMLElement).closest(
      "#hoursFormat-btn"
    );
    const searchedTimezonesModel = (e.target as HTMLElement).closest(
      "#searched-timezones"
    );
    if (!searchedTimezonesModel && !hoursFormatBtn) {
      setSearchTimezoneName("");
    }
  }

  useEventListener("click", dismissSearchedTimezonesOnOuterClick);

  return (
    <div className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-20 overflow-scroll">
      <main className="max-sm:px-4 max-sm:w-[1120px] w-[1100px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
