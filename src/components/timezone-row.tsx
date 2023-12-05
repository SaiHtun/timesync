import { NormalisedTimezone } from "~/utils/timezones";
import { Dispatch, SetStateAction, useMemo } from "react";
import Time from "./time";
import TimeDials from "./time-dials";
import { formatTimezone } from "~/utils/current-time";

interface Props {
  timezone: NormalisedTimezone;
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
  currentTimezoneIndex?: string;
}

export default function TimezoneRow({
  timezone,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
}: Props) {
  // country is usually undefined
  const [continent, city, country] = timezone.name.replace("_", " ").split("/");

  const { clock, dayOfWeek, month, dayOfMonth } = useMemo(
    () => formatTimezone(timezone.now),
    [timezone]
  );

  const isPositiveDiffHour = typeof timezone.diffHoursFromHome === "string";

  return (
    <div
      className="grid grid-cols-[300px_1fr] gap-2 h-[80px] items-center p-2 pr-4 rounded-sm cursor-pointer"
      onClick={() => {
        addToSelectedTimezones && addToSelectedTimezones(timezone);
      }}
      onMouseEnter={() => setSelectTimezoneIndex && setSelectTimezoneIndex(-1)}
    >
      <div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-8 text-center text-xs ${
                isPositiveDiffHour ? "text-green-500" : "text-red-500"
              }`}
            >
              {timezone.diffHoursFromHome}
            </span>
            <div>
              <p>
                {city}
                <sup className="ml-1 p-1 text-[10px] border rounded-md border-gray-400 text-gray-400 ">
                  {timezone.abbr}
                </sup>
              </p>
              <span className="text-sm text-gray-400">
                {country ? `${country}, ${continent}` : continent}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Time clock={clock} />
            <span className="text-xs text-gray-400">
              {dayOfWeek + ", " + month + " " + dayOfMonth}
            </span>
          </div>
        </div>
      </div>
      <TimeDials timezone={timezone} />
    </div>
  );
}
