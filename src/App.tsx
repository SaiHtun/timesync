import TimezonesBoard from "./components/TimezonesBoard";
import { useAtom } from "jotai";
import { syncUrlToSelectedTimezonesAtom } from "./atoms/selected-timezones";
import { useEffect } from "react";
import { useTimezonesParams } from "~/utils/hooks/use-timezones-params";
import { useEventListener } from "./utils/hooks/use-event-listener";
import { setSearchTimezoneNameAtom } from "./atoms/search-timezone-name";
import { detectAnyDOMsOnMouseEvent } from "./utils";
import {
  dismissDatePickerModelAtom,
  setSelectedDateAtom,
  startedDateAtom,
} from "./atoms/date";
import { useSearchParams } from "react-router-dom";
import { getLocalTime } from "./utils/timezones";

function App() {
  const timezonesName = useTimezonesParams();
  const [, setSearchTimezoneName] = useAtom(setSearchTimezoneNameAtom);
  const [, dismissDatePickerModel] = useAtom(dismissDatePickerModelAtom);
  const [, syncUrlToSelectedTimezones] = useAtom(
    syncUrlToSelectedTimezonesAtom
  );
  const [searchParams] = useSearchParams();
  const [, setSelectedDate] = useAtom(setSelectedDateAtom);
  const [, setStartedDate] = useAtom(startedDateAtom);

  function setStartedAndSelectedDate() {
    const startedDate = searchParams.get("selectedDate") || getLocalTime();
    setSelectedDate(startedDate);
    setStartedDate(new Date(startedDate));
  }

  useEffect(() => {
    syncUrlToSelectedTimezones(timezonesName);
    setStartedAndSelectedDate();
  }, [timezonesName]);

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
    <div className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-20 overflow-scroll">
      <main className="max-md:ml-10 max-md:mr-4 w-[1148px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
