import TimezonesBoard from "./components/TimezonesBoard";
import { useAtom } from "jotai";
import { syncUrlToSelectedTimezonesAtom } from "./atoms/selected-timezones";
import { useEffect } from "react";
import { useEventListener } from "./utils/hooks/use-event-listener";
import { setSearchTimezoneNameAtom } from "./atoms/search-timezone-name";
import { detectAnyDOMsOnMouseEvent } from "./utils";
import { dismissDatePickerModelAtom } from "./atoms/date";
import { readWriteUrlTimezonesNameAtom } from "./atoms/url-timezones-name";
import Navbar from "./components/NavBar";

function App() {
  const [, setSearchTimezoneName] = useAtom(setSearchTimezoneNameAtom);
  const [, dismissDatePickerModel] = useAtom(dismissDatePickerModelAtom);
  const [, syncUrlToSelectedTimezones] = useAtom(
    syncUrlToSelectedTimezonesAtom
  );
  const [urlTimezonesName] = useAtom(readWriteUrlTimezonesNameAtom);

  useEffect(() => {
    syncUrlToSelectedTimezones(urlTimezonesName);
  }, []);

  function resetStatesOnOuterClick(e: MouseEvent) {
    if (
      !detectAnyDOMsOnMouseEvent(e, [
        "#hoursFormat-btn",
        "#searched-timezones",
        "#calendar-btn",
        "#calendar",
        "#theme-btn",
      ])
    ) {
      setSearchTimezoneName("");
      dismissDatePickerModel();
    }
  }

  useEventListener("click", resetStatesOnOuterClick);

  return (
    <div className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-10 overflow-scroll">
      <main className="mx-8 lg:mx-auto w-[1148px] ">
        <Navbar />
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
