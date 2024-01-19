import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";
import TimeWindow, { type ITimeWindowProps } from "./TimeWindow";

export const DEFAULT_WINDOW_WIDTH = 34;
export const END_INDEX = 23;
const START_INDEX = 0;

export default function TimeSelectionOverlay() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentsPosition, setParentsPosition] = useState({ x: 0, y: 0 });
  const [mouseXposition, setMouseXposition] = useState(0);
  const [frameWidth, setFrameWidth] = useState(DEFAULT_WINDOW_WIDTH);
  const [isStopTimeWindow, setIsStopTimeWindow] = useState(false);
  const [isBlockClicked, setIsBlockClicked] = useState(false);

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
    const width =
      rightIndex * DEFAULT_WINDOW_WIDTH + (DEFAULT_WINDOW_WIDTH - frameWidth);

    return (
      <div
        className={cn("absolute right-0 h-full bg-zinc-400/20", {
          "cursor-e-resize": isStopTimeWindow && !isBlockClicked,
        })}
        style={{ width: `${width + 16}px` }}
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
      className="absolute right-0 top-0 !bg-transparent rounded-md w-[833px] h-full "
      onMouseMove={handleMouseMove}
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
      <TimeWindow {...timeWindowProps} />
    </div>
  );
}
