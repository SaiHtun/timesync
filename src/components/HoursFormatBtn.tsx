import { useAtom } from "jotai";
import {
  HoursFormat,
  hoursFormatAtom,
  toggleHoursFormatAtom,
} from "~/atoms/hours-format";
import { cn } from "~/utils/cn";

interface HourProps {
  hoursFormat: HoursFormat;
  expectedHoursFormat: HoursFormat;
}

function Hour({ hoursFormat, expectedHoursFormat }: HourProps) {
  return (
    <p
      className={cn(
        " text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50  transition-colors shadow-inner w-full h-full flex items-center justify-center",
        {
          "primary_bg text-zinc-800 dark:text-white shadow dark:shadow-zinc-900":
            hoursFormat === expectedHoursFormat,
          "rounded-l-md": expectedHoursFormat === "hour24",
          "rounded-r-md": expectedHoursFormat === "hour12",
        }
      )}
    >
      {expectedHoursFormat === "hour24" ? 24 : 12}
    </p>
  );
}

export default function HoursFormatBtn() {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [, toggleHoursFormat] = useAtom(toggleHoursFormatAtom);

  return (
    <button
      id="hoursFormat-btn"
      type="button"
      className="flex items-center text-xs w-20 h-full primary_border transition-all"
      onClick={toggleHoursFormat}
    >
      <Hour hoursFormat={hoursFormat} expectedHoursFormat="hour24" />
      <Hour hoursFormat={hoursFormat} expectedHoursFormat="hour12" />
    </button>
  );
}
