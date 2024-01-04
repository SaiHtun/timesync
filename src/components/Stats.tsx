import { useAtom } from "jotai";
import { selectedTimezonesLengthAtom } from "~/atoms/selected-timezones";
import { cn } from "~/utils/cn";

const TIMEZONES_LIMIT = 10;

export default function Stats() {
  const [selectedTimezonesLength] = useAtom(selectedTimezonesLengthAtom);

  return (
    <div>
      <p className="p-2 text-xs space-x-1">
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
      </p>
    </div>
  );
}
