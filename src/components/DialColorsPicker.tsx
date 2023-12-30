import { PaintBucket } from "lucide-react";
import { useAtom } from "jotai";
import { dialColorsModelAtom } from "~/atoms/dial-colors-model";

import DialColorsModel from "./DialColorsModel";

export default function DialColorsPicker() {
  const [isModelOpen, setIsModelOpen] = useAtom(dialColorsModelAtom);

  return (
    <div
      className="group absolute z-10 left-20 top-[6px] h-fit flex flex-col gap-2 cursor-pointer"
      onMouseOver={() => setIsModelOpen(true)}
      onMouseLeave={() => setIsModelOpen(false)}
    >
      <button className="flex items-center justify-center p-[5px] w-fit h-full rounded-md group-hover:feature_bg">
        <PaintBucket strokeWidth={1} size={22} />
      </button>
      <DialColorsModel isModelOpen={isModelOpen} />
    </div>
  );
}
