import { getTimeDials, type Timezone } from "~/utils/hooks/use-timezones";
import { Dispatch, SetStateAction, useMemo } from "react";
import Time from "./time";
import TimeDials from "./time-dials";
import { cn } from "~/utils/cn";
import { getDifferenceHoursFromHome } from "~/utils/hooks/use-timezones";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import AbbrBadge from "./abbr-badge";

interface Props {
  timezone: Timezone;
  addToSelectedTimezones?: (timezone: Timezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
  currentTimezoneIndex?: string;
}

export default function TimezoneRow({
  timezone,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
}: Props) {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  timezone.timeDials = useMemo(
    () => getTimeDials(timezone.clock, timezone.offset, hoursFormat),
    [timezone]
  );

  timezone.diffHoursFromHome = getDifferenceHoursFromHome(timezone.name);
  // country is usually undefined
  const [continent, city, country] = timezone.name.replace("_", " ").split("/");
  const { dayOfWeek, clock, monthAndDay } = timezone;

  return (
    <div
      className="grid grid-cols-[300px_1fr] gap-2 h-[80px] items-center p-2 pr-4 rounded-md cursor-pointer"
      onClick={() => {
        addToSelectedTimezones && addToSelectedTimezones(timezone);
      }}
      onMouseEnter={() => setSelectTimezoneIndex && setSelectTimezoneIndex(-1)}
    >
      <div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span
              className={cn("w-8 text-center text-xs text-red-500", {
                "text-green-500": parseInt(timezone.diffHoursFromHome) >= 0,
              })}
            >
              {timezone.diffHoursFromHome}
            </span>
            <div>
              <p>
                {city}
                <AbbrBadge abbr={timezone.abbr} />
              </p>
              <span className="text-sm primary_text_gray">
                {country ? `${country}, ${continent}` : continent}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Time clock={clock} />
            <span className="text-xs primary_text_gray">
              {dayOfWeek + ", " + monthAndDay}
            </span>
          </div>
        </div>
      </div>
      <TimeDials timezone={timezone} />
    </div>
  );
}
