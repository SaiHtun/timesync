import { useEffect, useRef, useState } from "react";

export default function TimeSelectionOverlay() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentsPosition, setParentsPosition] = useState({ x: 0, y: 0 });
  const [mouseXposition, setMouseXposition] = useState(0);
  const DEFAULT_FRAME_WIDTH = 34;
  const [frameWidth, setFrameWidth] = useState(DEFAULT_FRAME_WIDTH);
  const START_INDEX = 0;
  const END_INDEX = 23;
  const [isStop, setIsStop] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      const { x, y } = parentRef.current.getBoundingClientRect();
      setParentsPosition({ x, y });
    }
  }, [window.innerWidth]);

  function handleMouseMove(e: React.MouseEvent) {
    if (isStop) return;

    const indexOfTimeDial = Math.floor(
      (e.clientX - parentsPosition.x) / frameWidth
    );

    if (indexOfTimeDial >= START_INDEX && indexOfTimeDial <= END_INDEX) {
      setMouseXposition(frameWidth * indexOfTimeDial);
    }
  }
  function gg(e: React.MouseEvent) {
    const indexOfTimeDial = Math.floor(
      (e.clientX - parentsPosition.x) / DEFAULT_FRAME_WIDTH
    );
    if (indexOfTimeDial >= START_INDEX && indexOfTimeDial <= END_INDEX) {
      setMouseXposition(DEFAULT_FRAME_WIDTH * indexOfTimeDial);
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
    const rightIndex = END_INDEX - mouseXposition / DEFAULT_FRAME_WIDTH;
    const width =
      rightIndex * DEFAULT_FRAME_WIDTH + (DEFAULT_FRAME_WIDTH - frameWidth);

    return (
      <div
        className="absolute right-0 h-full bg-zinc-400/20"
        style={{ width: `${width + 16}px` }}
      ></div>
    );
  }

  function handleStop(e: React.MouseEvent) {
    setIsStop(!isStop);
    frameWidth === DEFAULT_FRAME_WIDTH
      ? setFrameWidth(frameWidth / 2)
      : setFrameWidth(DEFAULT_FRAME_WIDTH);
  }

  return (
    <div
      ref={parentRef}
      className="absolute right-0 top-0 !bg-transparent rounded-md w-[833px] h-full "
      onMouseMove={handleMouseMove}
    >
      {isStop && (
        <div
          onClick={(e) => {
            gg(e);
            setFrameWidth(DEFAULT_FRAME_WIDTH);
            setIsStop(false);
          }}
        >
          <LeftBlock />
          <RightBlock />
        </div>
      )}
      <div
        className="absolute h-full border-2 border-dotted border-red-500 rounded-md transition-all ease-out"
        style={{
          left: mouseXposition,
          width: `${frameWidth + 2}px`,
        }}
        onClick={handleStop}
      ></div>
    </div>
  );
}
