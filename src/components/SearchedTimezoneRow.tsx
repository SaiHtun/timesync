import { cn } from "~/utils/cn";
import type { Timezone } from "~/utils/hooks/use-timezones";
import Time from "./time";
import { useAtom } from "jotai";
import { addSelectedTimezonesAtom } from "~/atoms/selected-timezones";

interface Props {
  timezone: Timezone;
  isSelected: boolean;
  setSelectedTimezoneIndex: (index: number) => void;
  rowIndex: number;
}

export default function SearchedTimezoneRow({
  timezone,
  isSelected,
  setSelectedTimezoneIndex,
  rowIndex,
}: Props) {
  const [, addSelectedTimezones] = useAtom(addSelectedTimezonesAtom);

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md ",
        {
          "!bg-zinc-100 dark:!bg-zinc-700": isSelected,
        }
      )}
      onClick={() => addSelectedTimezones(timezone)}
      onMouseOver={() => setSelectedTimezoneIndex(rowIndex)}
    >
      <p className="flex items-center gap-1">
        <span>{timezone.name}</span>
        <span className="text-xs primary_text_gray">{timezone.abbr}</span>
      </p>
      <Time clock={timezone.clock} />
    </button>
  );
}
