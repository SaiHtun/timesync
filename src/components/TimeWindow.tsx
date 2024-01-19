import { SetStateAction, useRef, useState } from "react";
import { END_INDEX, DEFAULT_WINDOW_WIDTH } from "./TimeSelectionOverlay";
import { cn } from "~/utils/cn";

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
  const [leftRight, setLeftRight] = useState<"left" | "right" | "">("");
  const [timeWindow, setTimeWindow] = useState({ start: 0, end: 0 });
  const timeWindowDivRef = useRef<HTMLDivElement>(null);

  function stopTimeWindow() {
    setIsStopTimeWindow(!isStopTimeWindow);
    frameWidth === DEFAULT_WINDOW_WIDTH
      ? setFrameWidth(frameWidth / 2)
      : setFrameWidth(DEFAULT_WINDOW_WIDTH);
    setIsBlockClicked(false);
  }

  function handleMouseDown(event: React.MouseEvent) {
    stopTimeWindow();
    moveTimeWindow(event);
    if (isStopTimeWindow) return;
    const initialX = event.clientX;

    if (leftRight === "right") setMouseXposition((p) => p + HALF_WINDOW_WIDTH);

    function handleMouseMove(event: MouseEvent) {
      const dX = event.clientX - initialX;
      const indexOfHalfTimeDial = Math.floor(dX / HALF_WINDOW_WIDTH) || 1;
      const extraValue = leftRight === "right" ? 0.5 : 0;
      const indexOfLeftTimeDial =
        mouseXposition / DEFAULT_WINDOW_WIDTH + extraValue;
      const newWindowWidth = indexOfHalfTimeDial * HALF_WINDOW_WIDTH;

      // WTFFFFFF!!!!!
      const start = indexOfLeftTimeDial;
      const end =
        indexOfLeftTimeDial + newWindowWidth / DEFAULT_WINDOW_WIDTH - 1;

      setTimeWindow({ start, end });

      const isWithinTimeDials =
        newWindowWidth > HALF_WINDOW_WIDTH &&
        indexOfHalfTimeDial / 2 <= END_INDEX + 1 - indexOfLeftTimeDial;

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
    dX <= 17 ? setLeftRight("left") : setLeftRight("right");
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
      onMouseLeave={() => setLeftRight("")}
    >
      <div
        className={cn(
          "w-[17px] h-full absolute left-0 top-0 rounded-tl-md rounded-bl-md transition-colors",
          {
            "bg-red-600/10": leftRight === "left" && !isBlockClicked,
          }
        )}
      ></div>
      <div
        className={cn(
          "w-[17px] h-full absolute right-0 top-0 rounded-tr-md rounded-br-md transition-colors",
          {
            "bg-red-600/10": leftRight === "right" && !isBlockClicked,
          }
        )}
      ></div>
    </div>
  );
}
