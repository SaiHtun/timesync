import { memo } from "react";
import { type Timezone } from "~/utils/hooks/use-timezones";
import Clock from "~/components/Clock";
import TimeDials from "./TimeDials";
import { cn } from "~/utils/cn";
import { getDifferenceHoursFromHome } from "~/utils/hooks/use-timezones";
import { useAtom } from "jotai";
import AbbrBadge from "./AbbrBadge";
import { homeSelectedTimezonesAtom } from "~/atoms/selected-timezones";
import { Home } from "lucide-react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

interface Props {
  timezone: Timezone;
  isHome: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

export default function SelectedTimezoneRow({
  timezone,
  isHome,
  provided,
  snapshot,
}: Props) {
  const [homeSelectedTimezone] = useAtom(homeSelectedTimezonesAtom);

  timezone.diffHoursFromHome = getDifferenceHoursFromHome(
    timezone.name,
    homeSelectedTimezone.name
  );
  // country is usually undefined
  const [continent, city, country] = timezone.name.replace("_", " ").split("/");
  const { dayOfWeek, clock, monthAndDay } = timezone;

  return (
    <div
      className="grid grid-cols-[300px_1fr] gap-2 h-[80px] items-center p-2 pr-4 rounded-md cursor-pointer "
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {isHome ? (
              <Home size={20} className="w-8" />
            ) : (
              <span
                className={cn("w-8 text-center text-xs text-red-500", {
                  "text-green-500": parseInt(timezone.diffHoursFromHome) >= 0,
                })}
              >
                {timezone.diffHoursFromHome}
              </span>
            )}
            <div>
              <p>
                {city}
                <AbbrBadge abbr={timezone.abbr} />
              </p>
              <span className="text-sm primary_text_gray">
                {country ? `${country}, ${continent}` : continent}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Clock clock={clock} />
            <span className="text-xs primary_text_gray">
              {dayOfWeek + ", " + monthAndDay}
            </span>
          </div>
        </div>
      </div>
      <TimeDials timezone={timezone} />
    </div>
  );
}
