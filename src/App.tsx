import TimezonesBoard from "./components/TimezonesBoard";
import { useAtom } from "jotai";
import { syncUrlToSelectedTimezonesAtom } from "./atoms/selected-timezones";
import { useEffect } from "react";
import { getCurrentUserTimezoneName } from "./utils/hooks/use-timezones";
import { useParams } from "~/utils/hooks/use-params";
function App() {
  const z = useParams<string[]>("timezones", [getCurrentUserTimezoneName()]);

  const [, syncUrlToSelectedTimezones] = useAtom(
    syncUrlToSelectedTimezonesAtom
  );

  useEffect(() => {
    z && syncUrlToSelectedTimezones(z);
  }, [z, syncUrlToSelectedTimezones]);

  return (
    <div className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-20 overflow-scroll">
      <main className="max-sm:px-4 max-sm:w-[1120px] w-[1100px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
