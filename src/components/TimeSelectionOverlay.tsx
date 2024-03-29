import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";
import TimeWindow, { type ITimeWindowProps } from "./TimeWindow";
import { useAtom } from "jotai";
import {
  homeSelectedTimezonesAtom,
  selectedTimezonesLengthAtom,
} from "~/atoms/selected-timezones";
import { getHoursFromTimeString } from "~/utils/time-parser";
import { readWriteUrlTimeWindowIndexesAtom } from "~/atoms/hash-url";

export const DEFAULT_WINDOW_WIDTH = 32;
export const END_INDEX = 23;
const START_INDEX = 0;

export default function TimeSelectionOverlay() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentsPosition, setParentsPosition] = useState({ x: 0, y: 0 });
  const [homeSelectedTimezone] = useAtom(homeSelectedTimezonesAtom);
  const [mouseXposition, setMouseXposition] = useState(0);
  const [frameWidth, setFrameWidth] = useState(DEFAULT_WINDOW_WIDTH);
  const [isStopTimeWindow, setIsStopTimeWindow] = useState(false);
  const [isBlockClicked, setIsBlockClicked] = useState(false);
  const [selectedTimezonesLength] = useAtom(selectedTimezonesLengthAtom);
  const [urlTimeWindowIndexes] = useAtom(readWriteUrlTimeWindowIndexesAtom);

  function moveTimeWindowBarToHomeHours() {
    // if url has "timeWindowIndexes", remains! else go home's timezone hours
    if (urlTimeWindowIndexes) {
      const { start, end } = urlTimeWindowIndexes;
      const newFrameWidth = (end - start) * DEFAULT_WINDOW_WIDTH;

      setMouseXposition(start * DEFAULT_WINDOW_WIDTH);
      setFrameWidth(newFrameWidth);
      setIsStopTimeWindow(true);
      setIsBlockClicked(true);

      return;
    }

    const hour24 = getHoursFromTimeString(homeSelectedTimezone.hour24);

    if (homeSelectedTimezone && homeSelectedTimezone.timeDials.length) {
      let timeDialIndex = homeSelectedTimezone.timeDials.findIndex(
        (td) => td.hour24 === hour24
      );

      if (!isStopTimeWindow) {
        setMouseXposition(timeDialIndex * DEFAULT_WINDOW_WIDTH);
      }
    }
  }

  useEffect(() => {
    moveTimeWindowBarToHomeHours();
  }, [homeSelectedTimezone.timeDials, urlTimeWindowIndexes]);

  useEffect(() => {
    if (parentRef.current) {
      const { x, y } = parentRef.current.getBoundingClientRect();
      setParentsPosition({ x, y });
    }
  }, [window.innerWidth]);

  function handleMouseMove(e: React.MouseEvent) {
    if (isStopTimeWindow) return;
    moveTimeWindow(e);
  }

  function moveTimeWindow(e: React.MouseEvent) {
    const indexOfTimeDial = Math.floor(
      (e.clientX - parentsPosition.x) / DEFAULT_WINDOW_WIDTH
    );
    if (indexOfTimeDial >= START_INDEX && indexOfTimeDial <= END_INDEX) {
      setMouseXposition(DEFAULT_WINDOW_WIDTH * indexOfTimeDial);
    }
  }

  function LeftBlock() {
    const leftIndex = mouseXposition / frameWidth;
    const width = leftIndex * frameWidth;

    return (
      <div
        className="absolute left-0 h-full bg-zinc-400/20"
        style={{ width: `${width}px` }}
      ></div>
    );
  }

  function RightBlock() {
    const rightIndex = END_INDEX - mouseXposition / DEFAULT_WINDOW_WIDTH;
    // 23 is a magic number :D
    const width =
      rightIndex * DEFAULT_WINDOW_WIDTH +
      (DEFAULT_WINDOW_WIDTH - frameWidth + 23);

    return (
      <div
        className={cn("absolute right-0 h-full bg-zinc-400/20", {
          "cursor-e-resize": isStopTimeWindow && !isBlockClicked,
        })}
        style={{ width: `${width}px` }}
      ></div>
    );
  }

  const timeWindowProps: ITimeWindowProps = {
    isStopTimeWindow,
    frameWidth,
    isBlockClicked,
    mouseXposition,
    setIsStopTimeWindow,
    setMouseXposition,
    moveTimeWindow,
    setFrameWidth,
    setIsBlockClicked,
  };

  return (
    <div
      ref={parentRef}
      className="absolute right-0 top-0  rounded-md w-[793px] h-full !bg-transparent"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => moveTimeWindowBarToHomeHours()}
    >
      {isStopTimeWindow && (
        <div
          onClick={(e) => {
            if (isStopTimeWindow) setIsBlockClicked(true);
            if (isBlockClicked) {
              moveTimeWindow(e);
              setIsBlockClicked(false);
              setIsStopTimeWindow(false);
              setFrameWidth(DEFAULT_WINDOW_WIDTH);
            }
          }}
        >
          <LeftBlock />
          <RightBlock />
        </div>
      )}
      {selectedTimezonesLength ? <TimeWindow {...timeWindowProps} /> : ""}
    </div>
  );
}
