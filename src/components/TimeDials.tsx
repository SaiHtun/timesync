import { memo } from "react";
import { arrayRange } from "~/utils/index";
import { format, addDays } from "date-fns";
import { type Timezone, isDecimal } from "~/utils/hooks/use-timezones";
import { formatInTimeZone } from "date-fns-tz";
import { cn } from "~/utils/cn";

interface Props {
  timezone: Timezone;
}

function getNextDay(timezoneName: string, numberOfDays: number): string[] {
  const ad = addDays(
    new Date(formatInTimeZone(new Date(), timezoneName, "yyyy-MM-dd HH:mm")),
    numberOfDays
  );

  return format(ad, "eee, MMM d").split(", ");
}

export default memo(function TimeDials({ timezone }: Props) {
  const [dayOfWeek, monthAndDay] = getNextDay(timezone.name, 1);
  // 24 hours format for easily index the "New Day"
  const startHours24 = parseInt(
    formatInTimeZone(new Date(), timezone.name, "k")
  );

  const hours24 = arrayRange(startHours24, startHours24 + 23);

  function isNewDay(hourIndex: number) {
    return hours24[hourIndex] === 24 && hourIndex !== 0;
  }

  function isLastDay(hourIndex: number) {
    return hours24[hourIndex] === 23;
  }

  function NewDay() {
    const [month, day] = monthAndDay.split(" ");
    return (
      <div className={cn("text-xs")}>
        <p className="flex flex-col ">
          <span>{month}</span>
          <span>{day}</span>
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className="h-[40px] w-[760px] flex items-center  text-center text-sm rounded-l-md">
        {timezone.timeDials?.map(({ hour, dailyCircleBgColor }, index) => {
          return (
            <div
              key={index}
              className={cn(
                "w-[31.67px] h-full py-1 first:rounded-l-md relative flex items-center justify-center text-dial-newday dark:text-white",
                dailyCircleBgColor,
                {
                  "!rounded-l-md !bg-dial-newday  !text-white": isNewDay(index),
                  "!rounded-r-md": isLastDay(index),
                  "!text-white": dailyCircleBgColor.includes("newday"),
                  "!text-zinc-100": dailyCircleBgColor.includes("midnight"),
                }
              )}
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
                          className={cn("text-zinc-800 dark:text-white", {
                            "text-[11px] text-zinc-400": index === 1,
                            "!text-zinc-100":
                              dailyCircleBgColor.includes("midnight"),
                          })}
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
});
