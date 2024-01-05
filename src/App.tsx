import TimezonesBoard from "./components/TimezonesBoard";
import { useAtom } from "jotai";
import { syncUrlToSelectedTimezonesAtom } from "./atoms/selected-timezones";
import { useEffect } from "react";
import { useTimezonesParams } from "~/utils/hooks/use-params";
import { useEventListener } from "./utils/hooks/use-event-listener";
import { setSearchTimezoneNameAtom } from "./atoms/search-timezone-name";

function App() {
  const timezonesName = useTimezonesParams();
  const [, setSearchTimezoneName] = useAtom(setSearchTimezoneNameAtom);
  const [, syncUrlToSelectedTimezones] = useAtom(
    syncUrlToSelectedTimezonesAtom
  );

  useEffect(() => {
    syncUrlToSelectedTimezones(timezonesName);
  }, [timezonesName]);

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
      <main className="max-md:ml-10 max-md:mr-4 w-[1110px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;

// max-sm:pl-10 max-sm:pr-4
