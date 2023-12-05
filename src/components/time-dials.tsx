import { NormalisedTimezone } from "~/utils/timezones";
import { arrayRange } from "~/utils/index";
import { useMemo } from "react";
import { format } from "date-fns";
import { calcTime } from "~/utils/current-time";

interface Props {
  timezone: NormalisedTimezone;
}

export default function TimeDials({ timezone }: Props) {
  const [day, month] = timezone.now.split(",");
  const [alphabetMonth, numberOfDay] = month?.trim().split(" ");

  const hours = useMemo(() => {
    const startHours = parseInt(format(calcTime(timezone), "h"));
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
      <div className="h-auto w-[760px]  border border-zinc-150 dark:border-zinc-500 flex items-center text-center text-sm rounded-sm">
        {hours.map((hour) => {
          return (
            <div
              key={hour}
              className={`w-[32px] py-1 first:rounded-l-sm last:rounded-r-sm relative ${
                isNewDay(hour)
                  ? "!rounded-l-md !bg-emerald-500 box-border !text-white"
                  : ""
              }`}
            >
              <span className="absolute  inset-x-0 bottom-11 text-xs text-gray-400">
                {isNewDay(hour) ? day : ""}
              </span>
              {isNewDay(hour) ? (
                <div className="text-xs">
                  <p className="flex flex-col ">
                    <span>{alphabetMonth}</span>
                    <span>{parseInt(numberOfDay) + 1}</span>
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
