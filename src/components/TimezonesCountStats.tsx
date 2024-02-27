import { useAtom } from "jotai";
import { selectedTimezonesLengthAtom } from "~/atoms/selected-timezones";
import { cn } from "~/utils/cn";

const TIMEZONES_LIMIT = 10;

export default function TimezonesCountStats() {
  const [selectedTimezonesLength] = useAtom(selectedTimezonesLengthAtom);

  const timezone = selectedTimezonesLength > 1 ? "timezones" : "timezone";

  return (
    <div className=" flex justify-end mt-6">
      <div className="relative group group-hover:feature_bg">
        <button className="p-2 text-xs space-x-1">
          <span>{selectedTimezonesLength}</span>
          <span>/</span>
          <span
            className={cn("primary_text_gray", {
              "text-zinc-900 dark:text-zinc-50":
                TIMEZONES_LIMIT === selectedTimezonesLength,
            })}
          >
            {TIMEZONES_LIMIT}
          </span>
        </button>
        <div
          className="invisible group-hover:visible group-hover:-top-9 transition-all
        primary_border bg-white dark:bg-zinc-800 shadow-sm w-[170px] p-2 absolute text-xs -top-8 right-[50%] translate-x-[50%] z-10"
        >
          <p className="text-center">
            "{selectedTimezonesLength}" {timezone} out of "{TIMEZONES_LIMIT}"{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
