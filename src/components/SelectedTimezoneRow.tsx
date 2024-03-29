import Clock from "~/components/Clock";
import TimeDials from "./TimeDials";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import AbbrBadge from "./AbbrBadge";
import { deleteSelectedTimezoneAtom } from "~/atoms/selected-timezones";
import { Home, Trash2 } from "lucide-react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { hoursFormatAtom } from "~/atoms/hours-format";

interface IProps {
  timezone: ITimezone;
  isHome: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  index: number;
}

function DiffHoursFromHome({
  diffHoursFromHome,
}: {
  diffHoursFromHome: string;
}) {
  return (
    <p
      className={cn("w-6 text-center text-xs text-red-500", {
        "text-green-500": parseInt(diffHoursFromHome) >= 0,
      })}
    >
      {diffHoursFromHome}
    </p>
  );
}

function Region({ timezone }: { timezone: ITimezone }) {
  const [continent, city, country] = timezone.name.replace("_", " ").split("/");
  const { totalMeetingMinutes } = timezone;

  return (
    <div>
      <p>
        <span className="text-sm font-medium">{city}</span>
        {!totalMeetingMinutes && <AbbrBadge abbr={timezone.abbr} />}
      </p>
      <span className="text-sm primary_text_gray">
        {country && !totalMeetingMinutes
          ? `${country}, ${continent}`
          : continent}
      </span>
    </div>
  );
}

function CurrentTime({ timezone }: { timezone: ITimezone }) {
  const [hoursFormat] = useAtom(hoursFormatAtom);

  if (timezone.totalMeetingMinutes) {
    return (
      <div className="flex gap-1">
        {Object.entries(timezone.meetingHoursThreshold[hoursFormat]).map(
          ([, time], index) => {
            const [hours, date] = time as string[];
            const key = `${hours}, ${date}`;

            if (index === 0) {
              return (
                <div key={key} className="flex items-center gap-4">
                  <Time key={key} hours={hours} date={date} />
                  <div className="h-[2px] w-1 bg-zinc-600"></div>
                </div>
              );
            }
            return <Time key={key} hours={hours} date={date} />;
          }
        )}
      </div>
    );
  }

  return <Time hours={timezone[hoursFormat]} date={timezone.date} />;
}

function Time({ hours, date }: { hours: string; date: string }) {
  const [dayOfWeek, monthAndDay] = date.split(", ");

  return (
    <div className="text-right w-[74px]">
      <Clock clock={hours.toUpperCase()} />
      <span className="text-xs primary_text_gray">
        {dayOfWeek + ", " + monthAndDay}
      </span>
    </div>
  );
}

export default function SelectedTimezoneRow({
  timezone,
  isHome,
  provided,
  snapshot,
}: IProps) {
  const [, deleteSelectedTimezone] = useAtom(deleteSelectedTimezoneAtom);

  function handlePopTimezone() {
    const { name } = timezone;
    deleteSelectedTimezone(name);
  }

  return (
    <div
      className={cn(
        "group relative grid grid-cols-[340px_1fr] gap-2 h-[76px] items-center p-2 pr-4 rounded-md",
        {
          "shadow-md": snapshot.isDragging,
        }
      )}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div>
        <div
          className="flex justify-between items-center pl-2 pr-3"
          {...provided.dragHandleProps}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 group-hover:hidden">
              {isHome ? (
                <Home size={20} className="w-8" />
              ) : (
                <DiffHoursFromHome
                  diffHoursFromHome={timezone.diffHoursFromHome}
                />
              )}
            </div>
            <button
              type="button"
              className={cn("w-8 h-8 p-1 hidden group-hover:block z-10")}
              onClick={handlePopTimezone}
            >
              <Trash2
                strokeWidth={2}
                size={20}
                className="hover:text-red-500"
              />
            </button>
            <Region timezone={timezone} />
          </div>
          <CurrentTime timezone={timezone} />
        </div>
      </div>
      <TimeDials timezone={timezone} />
      <div className={cn(" h-[80px] w-20 absolute top-0 -left-8 ")}>
        {/* hacky way to overcome hovering the gap between parent(relative) and child(absolute) elements */}
      </div>
    </div>
  );
}
