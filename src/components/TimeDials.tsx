import { isDecimal } from "~/utils/timezones";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";

interface IProps {
  timezone: ITimezone;
}

function NewDay({ date }: { date: string }) {
  const [dayOfWeek, monthAndDay] = date.split(", ");
  const [month, numOfDay] = monthAndDay.split(" ");
  return (
    <>
      <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
        {dayOfWeek.toUpperCase()}
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

export default function TimeDials({ timezone }: IProps) {
  const [hoursFormat] = useAtom(hoursFormatAtom);

  return (
    <main>
      <div className="h-[40px] w-[816px] flex items-center text-center text-sm">
        {timezone.timeDials.map((timeDial, index) => {
          const {
            dailyCircleBgColor,
            isNewDay,
            date,
            isLastHour,
            timeMeridian,
          } = timeDial;
          const hour = timeDial[hoursFormat];
          return (
            <div
              key={index}
              className={cn(
                "leading-none w-[34px] h-full  p-1 relative flex flex-col items-center justify-center text-dial-newday dark:text-white",
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
                <NewDay date={date} />
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
                              className={cn(" text-zinc-800 dark:text-white", {
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
                    <p>
                      {isNewDay ? <NewDay date={date} /> : <span>{hour}</span>}
                    </p>
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
}
