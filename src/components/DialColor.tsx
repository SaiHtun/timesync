import { useAtom } from "jotai";
import { dialColorAtom } from "~/atoms/dial-colors-model";
import { DialColors } from "~/constants/colorsMap";
import { cn } from "~/utils/cn";

interface Props {
  dialColor: {
    name: DialColors;
    primaryColor: string;
  };
}

export default function DialColor({ dialColor }: Props) {
  const [dialColorName, setDialColorName] = useAtom(dialColorAtom);
  const { name, primaryColor } = dialColor;

  return (
    <div
      className={cn(
        primaryColor,
        "rounded-full w-5 h-5 hover:scale-110 hover:saturate-200 transition-all ease-linear",
        {
          "border-2 border-yellow-400": dialColorName === name,
        }
      )}
      onClick={() => setDialColorName(name)}
    />
  );
}
