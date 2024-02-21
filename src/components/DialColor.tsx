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
        "opacity-30 rounded-full w-5 h-5 hover:!opacity-100 transition-all ease-linear",
        {
          "opacity-1": dialColorName === name,
        }
      )}
      type="button"
      onClick={() => {
        setDialColor(name);
      }}
    />
  );
}
