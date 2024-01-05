import { memo, useMemo } from "react";
import { arrayRange } from "~/utils/index";
import {
  type Timezone,
  isDecimal,
  getTimeDials,
  getNextDay,
} from "~/utils/hooks/use-timezones";
import { formatInTimeZone } from "date-fns-tz";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";

interface Props {
  timezone: Timezone;
}

export default memo(function TimeDials({ timezone }: Props) {
  const [dayOfWeek] = getNextDay(timezone.name, 1).split(", ");
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);

  const timeDials = useMemo(
    () => getTimeDials(timezone, dialColor),
    [dialColor]
  );

  timezone.timeDials = timeDials;

  function isLastDay(hourIndex: number) {
    // 24 hours format for easily index the "New Day"
    const startHours24 = parseInt(
      formatInTimeZone(new Date(), timezone.name, "k")
    );
    const hours24 = arrayRange(startHours24, startHours24 + 23);
    return hours24[hourIndex] === 23;
  }

  function NewDay({ day }: { day: string }) {
    const monthAndDay = day.split(", ")[1];
    const [month, numOfDay] = monthAndDay.split(" ");
    return (
      <div className={cn("text-xs")}>
        <p className="flex flex-col ">
          <span>{month}</span>
          <span>{numOfDay}</span>
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className="h-[40px] w-[768px] flex items-center  text-center text-sm rounded-l-md">
        {timezone.timeDials.map(
          ({ hour12, hour24, dailyCircleBgColor, isNewDay, day }, index) => {
            const hour = hoursFormat === "24" ? hour24 : hour12;
            return (
              <div
                key={index}
                className={cn(
                  "w-[32px] h-full  py-1 first:rounded-l-md relative flex items-center justify-center text-dial-newday dark:text-white",
                  dailyCircleBgColor,
                  {
                    "!rounded-l-md !bg-dial-newday  !text-white": isNewDay,
                    "!rounded-r-md": isLastDay(index),
                    "!text-white": dailyCircleBgColor.includes("newday"),
                    "!text-zinc-100": dailyCircleBgColor.includes("midnight"),
                  }
                )}
              >
                <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
                  {isNewDay ? dayOfWeek : ""}
                </span>
                {isNewDay ? (
                  <NewDay day={day} />
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
                  <span>{isNewDay ? <NewDay day={day} /> : hour}</span>
                )}
              </div>
            );
          }
        )}
      </div>
    </main>
  );
});
