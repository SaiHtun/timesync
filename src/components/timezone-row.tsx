import { NormalisedTimezone } from "~/utils/timezones";
import { format } from "date-fns";

interface Props {
  timezone: NormalisedTimezone;
  isSelected: boolean;
}

export default function TimezoneRow({ timezone, isSelected }: Props) {
  const [continent, country, city] = timezone.name.split("/");

  return (
    <div
      className={`flex gap-2 justify-between items-center px-4 py-2 rounded-md ${
        isSelected ? "bg-indigo-400 text-white" : ""
      }`}
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
        <h3>{format(new Date(), "p")}</h3>
      </div>
    </div>
  );
}
