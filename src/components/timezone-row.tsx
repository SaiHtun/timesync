import { NormalisedTimezone } from "~/utils/timezones";
import { format } from "date-fns";

interface Props {
  timezone: NormalisedTimezone;
  selectTimezoneIndex: number;
  timezoneIndex: number;
}

export default function TimezoneRow({
  timezone,
  selectTimezoneIndex,
  timezoneIndex,
}: Props) {
  const [continent, country, city] = timezone.name.split("/");

  return (
    <div
      className={`flex gap-2 justify-between items-center px-4 py-2 rounded-md ${
        selectTimezoneIndex === timezoneIndex ? "bg-indigo-400 text-white" : ""
      }`}
    >
      <div className="flex gap-2">
        <span>{timezone.offset}</span>
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
