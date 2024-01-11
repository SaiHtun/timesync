import { useEffect, useRef, useState } from "react";

export default function TimeSelectionOverlay() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentsPosition, setParentsPosition] = useState({ x: 0, y: 0 });
  const [mouseXposition, setMouseXposition] = useState(0);
  const frameWidth = 34;
  const MIN_JUMPS = 0;
  const MAX_JUMPS = 23;

  useEffect(() => {
    if (parentRef.current) {
      const { x, y } = parentRef.current.getBoundingClientRect();
      setParentsPosition({ x, y });
    }
  }, [window.innerWidth]);

  function handleMouseMove(e: React.MouseEvent) {
    const numberOfJumps = Math.floor(
      (e.clientX - parentsPosition.x) / frameWidth
    );

    if (numberOfJumps >= MIN_JUMPS && numberOfJumps <= MAX_JUMPS) {
      setMouseXposition(frameWidth * numberOfJumps);
    }
  }

  return (
    <div
      ref={parentRef}
      className="absolute right-0 top-0  !bg-transparent  rounded-md w-[827px] h-full "
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute h-full border-2 border-dotted border-red-500 rounded-md transition-all ease-out"
        style={{
          left: mouseXposition,
          width: `${frameWidth + 2}px`,
        }}
      ></div>
    </div>
  );
}
