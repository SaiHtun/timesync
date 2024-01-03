import { useAtom } from "jotai";
import { hoursFormatAtom, toggleHoursFormatAtom } from "~/atoms/hours-format";
import { cn } from "~/utils/cn";

export default function HoursFormatBtn() {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [, toggleHoursFormat] = useAtom(toggleHoursFormatAtom);

  return (
    <button
      id="hoursFormat-btn"
      type="button"
      className="p-2 text-xs space-x-1 primary_border rounded-md transition-all hover:feature_bg shadow hover:shadow-none active:shadow-inner"
      onClick={toggleHoursFormat}
    >
      <span
        className={cn("dark:text-white text-zinc-900", {
          "text-zinc-400 dark:text-zinc-400": hoursFormat !== "24",
        })}
      >
        24
      </span>
      <span>/</span>
      <span
        className={cn("dark:text-white text-zinc-900", {
          "text-zinc-400 dark:text-zinc-400": hoursFormat !== "12",
        })}
      >
        {12}
      </span>
    </button>
  );
}
