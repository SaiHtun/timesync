import { arrayRange } from "~/utils/index";
import { format, addDays } from "date-fns";
import { type Timezone, isDecimal } from "~/utils/hooks/use-timezones";

interface Props {
  timezone: Timezone;
}

export default function TimeDials({ timezone }: Props) {
  const nextDay = addDays(new Date(timezone.monthAndDay), 0);

  const formatStr = "eee, MMM d";
  const [dayOfWeek, monthAndDay] = format(nextDay, formatStr).split(", ");

  const startHours = parseInt(timezone.clock.split(":")[0]);
  const hours24 = arrayRange(startHours, startHours + 23);

  function isNewDay(hourIndex: number) {
    return hours24[hourIndex] === 24 && hourIndex !== 0;
  }

  return (
    <main>
      <div className="h-auto w-[760px]  primary_border flex items-center text-center text-sm rounded-md">
        {timezone.timeDials?.map((hour, index) => {
          function NewDay() {
            const [month, day] = monthAndDay.split(" ");
            return (
              <div className="text-xs">
                <p className="flex flex-col ">
                  <span>{month}</span>
                  <span>{day}</span>
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
