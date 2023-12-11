import {
  NormalisedTimezone,
  TimezoneFormatType,
} from "~/utils/hooks/use-timezones";
import { Dispatch, SetStateAction, useMemo } from "react";
import Time from "./time";
import TimeDials from "./time-dials";
import { formatTimezone } from "~/utils/current-time";
import { cn } from "~/utils/cn";

interface Props {
  timezone: NormalisedTimezone;
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
  currentTimezoneIndex?: string;
  timezoneFormat: TimezoneFormatType;
}

export default function TimezoneRow({
  timezone,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
  timezoneFormat,
}: Props) {
  // country is usually undefined
  const [continent, city, country] = timezone.name.replace("_", " ").split("/");

  const { clock, dayOfWeek, month, dayOfMonth } = useMemo(
    () => formatTimezone(timezone.now, timezoneFormat),
    [timezone]
  );

  const isPositiveDiffHour = typeof timezone.diffHoursFromHome === "string";

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
                "text-green-500": isPositiveDiffHour,
              })}
            >
              {timezone.diffHoursFromHome}
            </span>
            <div>
              <p>
                {city}
                <sup className="ml-1 p-1 text-[10px] primary_border rounded-md primary_text_gray ">
                  {timezone.abbr}
                </sup>
              </p>
              <span className="text-sm primary_text_gray">
                {country ? `${country}, ${continent}` : continent}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Time clock={clock} />
            <span className="text-xs primary_text_gray">
              {dayOfWeek + ", " + month + " " + dayOfMonth}
            </span>
          </div>
        </div>
      </div>
      <TimeDials timezone={timezone} />
    </div>
  );
}
