import { NormalisedTimezone } from "~/utils/timezones";
import { arrayRange } from "~/utils/index";
import { useMemo } from "react";

interface Props {
  timezone: NormalisedTimezone;
}

export default function TimeDials({ timezone }: Props) {
  const [day, month] = timezone.now.split(",");
  const [alphaOfMonth, numberOfDay] = month.trim().split(" ");

  const hours = useMemo(
    () =>
      arrayRange(0, 23).map((number) => (number + timezone.offset + 24) % 24),
    [timezone]
  );

  let isDecimal = false;
  let newDay = false;

  return (
    <main>
      <p>{newDay ? day : ""}</p>
      <div className="h-auto w-full  border border-zinc-150 dark:border-zinc-500 flex items-center text-center text-sm rounded-md">
        {hours.map((hour) => {
          isDecimal = hour % 1 !== 0;
          newDay = hour === 0 || hour < 1;
          return (
            <div
              key={hour}
              className={`w-[29.17px] py-1 first:rounded-l-sm last:rounded-r-sm relative ${
                newDay
                  ? "!rounded-l-md !bg-emerald-500 box-border !text-white"
                  : ""
              }`}
            >
              <span className="absolute  inset-x-0 bottom-10 text-xs text-gray-400">
                {newDay ? day : ""}
              </span>
              {newDay ? (
                <div className="text-xs">
                  <p className="flex flex-col ">
                    <span>{alphaOfMonth}</span>
                    <span>{numberOfDay}</span>
                  </p>
                </div>
              ) : isDecimal && hour > 1 ? (
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
                          {index === 1 ? 30 : parseInt(strNum)}
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
