import { NormalisedTimezone } from "~/utils/timezones";
import { arrayRange } from "~/utils/index";
import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { formatTimezone } from "~/utils/current-time";

interface Props {
  timezone: NormalisedTimezone;
}

export default function TimeDials({ timezone }: Props) {
  const nextDay = addDays(new Date(timezone.now), 1);
  const { dayOfWeek, month, dayOfMonth } = formatTimezone(
    nextDay.toLocaleString()
  );

  const hours = useMemo(() => {
    const startHours = parseInt(format(new Date(timezone.now), "h"));
    return arrayRange(startHours, startHours + 23).map((number) => {
      let h = number;
      // some timezones have "decimal" offset. ex: +14.5 (Asia/Rangoon)
      if (isDecimal(timezone.offset)) {
        h += 0.5;
      }
      return h % 24;
    });
  }, [timezone]);

  function isDecimal(hour: number) {
    return hour % 1 !== 0;
  }

  function isNewDay(hour: number) {
    return hour < 1;
  }

  return (
    <main>
      <div className="h-auto w-[760px]  border border-zinc-150 dark:border-zinc-700 flex items-center text-center text-sm rounded-sm">
        {hours.map((hour, index) => {
          return (
            <div
              key={index}
              className={`w-[32px] py-1 first:rounded-l-sm last:rounded-r-sm relative ${
                isNewDay(hour)
                  ? "!rounded-l-md !bg-emerald-500 box-border !text-white"
                  : ""
              }`}
            >
              <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
                {isNewDay(hour) ? dayOfWeek : ""}
              </span>
              {isNewDay(hour) ? (
                <div className="text-xs">
                  <p className="flex flex-col ">
                    <span>{month}</span>
                    <span>{dayOfMonth}</span>
                  </p>
                </div>
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
                <span>{hour}</span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
