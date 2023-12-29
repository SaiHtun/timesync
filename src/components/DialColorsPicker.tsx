import { PaintBucket } from "lucide-react";
import { useAtom } from "jotai";
import { dialColorsModelAtom } from "~/atoms/dial-colors-model";

import DialColorsModel from "./DialColorsModel";

export default function DialColorsPicker() {
  const [isModelOpen, setIsModelOpen] = useAtom(dialColorsModelAtom);

  return (
    <div
      className="group absolute z-10 left-20 top-1 h-fit flex flex-col gap-2 cursor-pointer"
      onMouseOver={() => setIsModelOpen(true)}
      onMouseLeave={() => setIsModelOpen(false)}
    >
      <button className=" p-2 w-fit h-full">
        <PaintBucket strokeWidth={1} size={22} />
      </button>
      <DialColorsModel isModelOpen={isModelOpen} />
    </div>
  );
}
