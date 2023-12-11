import { NormalisedTimezone } from "~/utils/hooks/use-timezones";
import { arrayRange } from "~/utils/index";
import { format, addDays } from "date-fns";
import { formatTimezone } from "~/utils/current-time";
import { isDecimal } from "~/utils/hooks/use-timezones";

interface Props {
  timezone: NormalisedTimezone;
}

const FORMAT_STR_24 = "k";

export default function TimeDials({ timezone }: Props) {
  const nextDay = addDays(new Date(timezone.now), 1);
  const { dayOfWeek, month, dayOfMonth } = formatTimezone(
    nextDay.toLocaleString()
  );

  const start24Hours = parseInt(format(new Date(timezone.now), FORMAT_STR_24));
  const hours24 = arrayRange(start24Hours, start24Hours + 23);

  function isNewDay(hourIndex: number) {
    return hours24[hourIndex] === 24 && hourIndex !== 0;
  }

  return (
    <main>
      <div className="h-auto w-[760px]  primary_border flex items-center text-center text-sm rounded-md">
        {timezone.timeDials.map((hour, index) => {
          function NewDay() {
            return (
              <div className="text-xs">
                <p className="flex flex-col ">
                  <span>{month}</span>
                  <span>{dayOfMonth}</span>
                </p>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`w-[32px] py-1 first:rounded-l-sm last:rounded-r-sm relative ${
                isNewDay(index)
                  ? "!rounded-l-md !bg-emerald-500 box-border !text-white"
                  : ""
              }`}
            >
              <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
                {isNewDay(index) ? dayOfWeek : ""}
              </span>
              {isNewDay(index) ? (
                <NewDay />
              ) : isDecimal(hour) && hour > 1 ? (
                <p className="flex flex-col leading-3">
                  {hour
                    .toString()
                    .split(".")
                    .map((strNum, index) => {
                      return (
                        <span
                          className={`${
                            index === 1 ? "text-[11px] text-zinc-400" : ""
                          }`}
                          key={index}
                        >
                          {index === 1 ? 30 : strNum}
                        </span>
                      );
                    })}
                </p>
              ) : (
                <span>{isNewDay(index) ? <NewDay /> : hour}</span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
