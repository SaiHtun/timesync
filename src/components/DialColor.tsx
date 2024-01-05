import { useAtom } from "jotai";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";
import { DialColors } from "~/constants/colorsMap";
import { cn } from "~/utils/cn";

interface Props {
  dialColor: {
    name: DialColors;
    primaryColor: string;
  };
}

export default function DialColor({ dialColor }: Props) {
  const [dialColorName, setDialColor] = useAtom(dialColorWithLocalStorageAtom);

  const { name, primaryColor } = dialColor;

  return (
    <button
      className={cn(
        primaryColor,
        "rounded-full w-5 h-5 hover:scale-110 hover:saturate-200 transition-all ease-linear",
        {
          "outline-dashed outline-2 outline-yellow-500": dialColorName === name,
        }
      )}
      type="button"
      onClick={() => {
        setDialColor(name);
      }}
    />
  );
}
