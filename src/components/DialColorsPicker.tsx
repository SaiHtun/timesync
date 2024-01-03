import { Paintbrush } from "lucide-react";
import DialColorsModel from "./DialColorsModel";
import { useState } from "react";
import { cn } from "~/utils/cn";

export default function DialColorsPicker() {
  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <div
      className="group z-10 h-fit relative"
      id="colors-btn"
      onMouseEnter={() => setIsModelOpen(true)}
      onMouseLeave={() => setIsModelOpen(false)}
    >
      <button className="flex items-center justify-center p-2 w-fit h-full rounded-md group-hover:feature_bg group-hover:shadow-inner">
        {" "}
        <Paintbrush strokeWidth={1} size={20} />
      </button>
      <div
        className={cn("hidden h-8 w-10 absolute left-0 top-8", {
          block: isModelOpen,
        })}
      >
        {/* hacky way to overcome hovering the gap between parent(relative) and child(absolute) elements */}
      </div>
      <DialColorsModel isModelOpen={isModelOpen} />
    </div>
  );
}
