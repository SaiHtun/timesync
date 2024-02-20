import { isDecimal } from "~/utils/timezones";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { textColorSchemeAtom } from "~/atoms/dial-colors-model";

interface IProps {
  timezone: ITimezone;
}

function NewDay({ date }: { date: string }) {
  const [dayOfWeek, monthAndDay] = date.split(", ");
  const [month, numOfDay] = monthAndDay.split(" ");
  return (
    <>
      <span className="absolute  inset-x-0 bottom-[42px] text-[10px] text-gray-400">
        {dayOfWeek.toUpperCase()}
      </span>
      <div>
        <p className="flex flex-col gap-1 text-[11px]">
          <span>{month}</span>
          <span>{numOfDay}</span>
        </p>
      </div>
    </>
  );
}

export default function TimeDials({ timezone }: IProps) {
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [textColor] = useAtom(textColorSchemeAtom);

  return (
    <main>
      <div className="h-[38px] w-[768px] flex items-center text-center text-xs">
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
                "leading-none w-[32px] h-full  p-1 relative flex flex-col items-center justify-center text-dial-newday dark:text-white",
                dailyCircleBgColor,
                textColor["newday"],
                {
                  "!rounded-l-md !text-white": isNewDay,
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
                              className={cn({
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
