import { dialColors } from "~/constants/colorsMap";
import { PaintBucket } from "lucide-react";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import {
  dialColorsModelAtom,
  setDialColorAtom,
} from "~/atoms/dial-colors-model";

export default function DialColorsPicker() {
  const [isOpenModel, setIsOpenModel] = useAtom(dialColorsModelAtom);

  function ColorsModel() {
    return (
      <div className="p-2 grid grid-cols-3 grid-rows-2 w-[100px] h-fit primary_border primary_bg gap-1">
        {dialColors.map(({ name, color }) => {
          return (
            <div
              key={name}
              className={cn(color, "rounded-full w-6 h-6 hover:saturate-100")}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="absolute z-10 left-20 top-[2px]  h-fit flex flex-col gap-2 cursor-pointer"
      onMouseOver={() => setIsOpenModel(true)}
      onMouseLeave={() => setIsOpenModel(false)}
    >
      <button className=" p-2 w-fit h-full">
        <PaintBucket strokeWidth={1} size={24} />
      </button>
      {isOpenModel && <ColorsModel />}
    </div>
  );
}
