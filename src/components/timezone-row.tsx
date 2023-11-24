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
  // const now = useCurrentTime(timezone.name);
  // console.log(timezone.name, now);

  const isSelected = tzIndex === selectTimezoneIndex && isSelectedTimezones;

  return (
    <div
      className={`flex gap-2 justify-between items-center px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-400 hover:text-white ${
        isSelected ? "bg-indigo-400 text-white" : ""
      }`}
      onClick={() => {
        addToSelectedTimezones && addToSelectedTimezones(timezone);
      }}
      onMouseEnter={() => setSelectTimezoneIndex && setSelectTimezoneIndex(-1)}
    >
      <div className="flex gap-2">
        <span className="w-10 text-right border-r-white-600">
          {timezone.offset}
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
        <h3>{timezone.now}</h3>
      </div>
    </div>
  );
}
