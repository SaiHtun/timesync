import { NormalisedTimezone } from "~/utils/timezones";
import { Dispatch, SetStateAction } from "react";

interface Props {
  timezone: NormalisedTimezone;
  isSelectedTimezones?: boolean;
  tzIndex: number;
  selectTimezoneIndex?: number;
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
}

export default function TimezoneRow({
  timezone,
  isSelectedTimezones = false,
  tzIndex,
  selectTimezoneIndex = 0,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
}: Props) {
  const [continent, country, city] = timezone.name.replace("_", " ").split("/");

  const isSelected = tzIndex === selectTimezoneIndex && isSelectedTimezones;
  const isPositiveDiffHour = typeof timezone.diffHoursFromHome === "string";

  return (
    <div
      className="flex gap-2 h-[80px] justify-between items-center p-2 rounded-sm cursor-pointer"
      onClick={() => {
        addToSelectedTimezones && addToSelectedTimezones(timezone);
      }}
      onMouseEnter={() => setSelectTimezoneIndex && setSelectTimezoneIndex(-1)}
    >
      <div className="flex gap-2 items-center tabular-nums">
        <span
          className={`w-8 text-center text-xs ${
            isPositiveDiffHour ? "text-green-500" : "text-red-500"
          }`}
        >
          {timezone.diffHoursFromHome}
        </span>
        <div>
          <h3>{city ?? country}</h3>
          <span>
            {city ? `${country}, ` : ""}
            {continent}
          </span>
        </div>
      </div>
      <div>
        <p className="tabular-nums">{timezone.now}</p>
      </div>
    </div>
  );
}
