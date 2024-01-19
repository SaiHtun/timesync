import { memo, useMemo } from "react";
import { isDecimal, getTimeDials } from "~/utils/timezones";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";
import { selectedDateAtom } from "~/atoms/date";

interface IProps {
  timezone: ITimezone;
}

function NewDay({ day }: { day: string }) {
  const [dayOfWeek, monthAndDay] = day.split(", ");
  const [month, numOfDay] = monthAndDay.split(" ");
  return (
    <>
      <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
        {dayOfWeek}
      </span>
      <div className={cn("text-xs")}>
        <p className="flex flex-col ">
          <span>{month}</span>
          <span>{numOfDay}</span>
        </p>
      </div>
    </>
  );
}

export default memo(function TimeDials({ timezone }: IProps) {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);
  const [selectedDate] = useAtom(selectedDateAtom);

  const timeDials = useMemo(
    () => getTimeDials(timezone, dialColor),
    [dialColor, timezone, selectedDate]
  );

  timezone.timeDials = timeDials;

  return (
    <main>
      <div className="h-[40px] w-[816px] flex items-center text-center text-sm rounded-l-md">
        {timezone.timeDials.map((timeDial, index) => {
          const {
            dailyCircleBgColor,
            isNewDay,
            day,
            isLastHour,
            timeMeridian,
          } = timeDial;
          const hour = timeDial[hoursFormat];
          return (
            <div
              key={index}
              className={cn(
                "leading-none w-[34px] h-full  p-1 first:rounded-l-md relative flex flex-col items-center justify-center text-dial-newday dark:text-white",
                dailyCircleBgColor,
                {
                  "!rounded-l-md !bg-dial-newday  !text-white": isNewDay,
                  "!rounded-r-md": isLastHour,
                  "!text-white": dailyCircleBgColor.includes("newday"),
                  "!text-zinc-100": dailyCircleBgColor.includes("midnight"),
                }
              )}
            >
              {isNewDay ? (
                <NewDay day={day} />
              ) : (
                <>
                  {" "}
                  {isDecimal(hour) && hour > 1 ? (
                    <p
                      className={cn("flex leading-3", {
                        "flex-col": hoursFormat === "hour24",
                      })}
                    >
                      {hour
                        .toString()
                        .split(".")
                        .map((strNum, index) => {
                          return (
                            <span
                              className={cn("text-zinc-800 dark:text-white", {
                                "text-[9px]": index === 1,
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
                    <span>{isNewDay ? <NewDay day={day} /> : hour}</span>
                  )}
                  {hoursFormat === "hour12" && (
                    <span className="text-[10px] ">{timeMeridian}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
});
