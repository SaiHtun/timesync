import { SetStateAction, useEffect, useRef, useState } from "react";
import { END_INDEX, DEFAULT_WINDOW_WIDTH } from "./TimeSelectionOverlay";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { selectedTimezonesAtom } from "~/atoms/selected-timezones";
import { getNextDay, isDecimal } from "~/utils/timezones";
import { HoursFormat } from "~/atoms/hours-format";

function transformHours(
  timeDial: ITimeDial,
  timeDialIndex: number,
  isNewDay: boolean,
  hoursFormat: HoursFormat
): string[] {
  let hours = timeDial[hoursFormat];
  let minutes = 0;

  if (isDecimal(hours) && isDecimal(timeDialIndex)) {
    hours = Math.floor(hours) + 1;
  } else if (isDecimal(timeDialIndex)) {
    minutes = 30;
  } else if (isDecimal(hours)) {
    hours = Math.floor(hours);
    minutes = 30;
  }

  const h = hoursFormat === "hour24" ? String(hours).padStart(2, "0") : hours;

  const time =
    h + ":" + (minutes ? minutes : "00") + " " + timeDial.timeMeridian;

  const date = timeDial.date.split(", ").slice(0, 2).join(", ");

  const d = isNewDay ? getNextDay(date, 1, "eee, MMM d") : date;
  return [time, d];
}

function calMeetingHoursThreshold(
  timeDials: ITimeDial[],
  timeWindowIndex: { start: number; end: number }
) {
  let meetingHours: IMeetingHoursThreshold = {
    hour12: {
      start: [],
      end: [],
    },
    hour24: {
      start: [],
      end: [],
    },
  };

  for (const i in timeWindowIndex) {
    const originIdx = timeWindowIndex[i as keyof typeof timeWindowIndex];
    const idx = originIdx % timeDials.length;

    const isNewDay = originIdx === 24;

    const timeDial = timeDials[Math.floor(idx)];

    Object.keys(meetingHours).forEach((hours) => {
      const h = hours as HoursFormat;
      meetingHours[h][i] = transformHours(timeDial, idx, isNewDay, h);
    });
  }

  return meetingHours;
}

function calTotalMeetingMinutes(timeWindowIndex: {
  start: number;
  end: number;
}): number {
  const { start, end } = timeWindowIndex;
  const dx = end - start;

  return dx * 60;
}

export interface ITimeWindowProps {
  isStopTimeWindow: boolean;
  frameWidth: number;
  isBlockClicked: boolean;
  mouseXposition: number;
  setIsStopTimeWindow: React.Dispatch<SetStateAction<boolean>>;
  moveTimeWindow: (e: React.MouseEvent) => void;
  setIsBlockClicked: React.Dispatch<SetStateAction<boolean>>;
  setMouseXposition: React.Dispatch<SetStateAction<number>>;
  setFrameWidth: React.Dispatch<SetStateAction<number>>;
}

const HALF_WINDOW_WIDTH = 17;

export default function TimeWindow({
  isStopTimeWindow,
  frameWidth,
  mouseXposition,
  isBlockClicked,
  moveTimeWindow,
  setIsStopTimeWindow,
  setIsBlockClicked,
  setMouseXposition,
  setFrameWidth,
}: ITimeWindowProps) {
  const [sidesOfTimeWindow, setSidesOfTimeWindow] = useState<
    "left" | "right" | ""
  >("");
  const [timeWindowIndex, setTimeWindowIndex] = useState({ start: 0, end: 0 });
  const timeWindowDivRef = useRef<HTMLDivElement>(null);
  const [, setSelectedTimezones] = useAtom(selectedTimezonesAtom);

  function getIndexOfLeftTimeDial() {
    const halfHour = sidesOfTimeWindow === "right" ? 0.5 : 0;
    return mouseXposition / DEFAULT_WINDOW_WIDTH + halfHour;
  }

  function stopTimeWindow() {
    setIsStopTimeWindow(!isStopTimeWindow);
    frameWidth === DEFAULT_WINDOW_WIDTH
      ? setFrameWidth(frameWidth / 2)
      : setFrameWidth(DEFAULT_WINDOW_WIDTH);
    setIsBlockClicked(false);

    setTimeWindowIndex((p) => ({ ...p, start: getIndexOfLeftTimeDial() }));
  }

  useEffect(() => {
    setSelectedTimezones((prevTimezones) => {
      return prevTimezones.map((tz) => {
        tz.meetingHoursThreshold = calMeetingHoursThreshold(
          tz.timeDials,
          timeWindowIndex
        );
        tz.totalMeetingMinutes = calTotalMeetingMinutes(timeWindowIndex);

        return tz;
      });
    });
  }, [isStopTimeWindow, isBlockClicked]);

  function handleMouseDown(event: React.MouseEvent) {
    stopTimeWindow();
    moveTimeWindow(event);
    if (isStopTimeWindow) return;
    const initialX = event.clientX;
    // if clicked the right panel of timeWindow, it should move +HALF_WINDOW_WIDTH
    if (sidesOfTimeWindow === "right")
      setMouseXposition((p) => p + HALF_WINDOW_WIDTH);

    function handleMouseMove(event: MouseEvent) {
      const dX = event.clientX - initialX;
      const numberOfHalfTimeDial = Math.floor(dX / HALF_WINDOW_WIDTH) || 1;
      const newWindowWidth = numberOfHalfTimeDial * HALF_WINDOW_WIDTH;
      const indexOfLeftTimeDial = getIndexOfLeftTimeDial();
      const start = indexOfLeftTimeDial;
      const end = indexOfLeftTimeDial + newWindowWidth / DEFAULT_WINDOW_WIDTH;

      setTimeWindowIndex({ start, end });

      const isWithinTimeDials =
        newWindowWidth > HALF_WINDOW_WIDTH &&
        numberOfHalfTimeDial / 2 <= END_INDEX + 1 - indexOfLeftTimeDial;

      setFrameWidth(isWithinTimeDials ? newWindowWidth : HALF_WINDOW_WIDTH);
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMoveOnTimeWindow(e: React.MouseEvent) {
    const timeWindowX = timeWindowDivRef.current?.getBoundingClientRect().x!;
    const dX = e.clientX - timeWindowX;
    dX <= 17 ? setSidesOfTimeWindow("left") : setSidesOfTimeWindow("right");
  }

  return (
    <div
      className={cn(
        "absolute h-full border-2 border-dotted border-red-500 rounded-md transition-all ease-out",
        {
          "transition-none cursor-e-resize":
            isStopTimeWindow && !isBlockClicked,
        }
      )}
      style={{
        left: mouseXposition,
        width: `${frameWidth + 2}px`,
        resize: "horizontal",
      }}
      ref={timeWindowDivRef}
      onClick={handleMouseDown}
      onMouseMove={handleMouseMoveOnTimeWindow}
      onMouseLeave={() => setSidesOfTimeWindow("")}
    >
      <div
        className={cn(
          "w-[17px] h-full absolute left-0 top-0 rounded-tl-md rounded-bl-md transition-colors",
          {
            "bg-red-600/10": sidesOfTimeWindow === "left" && !isBlockClicked,
          }
        )}
      ></div>
      <div
        className={cn(
          "w-[17px] h-full absolute right-0 top-0 rounded-tr-md rounded-br-md transition-colors",
          {
            "bg-red-600/10": sidesOfTimeWindow === "right" && !isBlockClicked,
          }
        )}
      ></div>
    </div>
  );
}
