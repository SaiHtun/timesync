import { cn } from "~/utils/cn";
import type { Timezone, TimezoneFormatType } from "~/utils/hooks/use-timezones";
import Time from "./time";

interface Props {
  timezone: Timezone;
  timezoneFormat: TimezoneFormatType;
  addToSelectedTimezones: (timezone: Timezone) => void;
  isSelected: boolean;
  setSelectedTimezoneIndex: (index: number) => void;
  rowIndex: number;
}

export default function SearchedTimezoneRow({
  timezone,
  addToSelectedTimezones,
  isSelected,
  setSelectedTimezoneIndex,
  rowIndex,
}: Props) {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md ",
        {
          "!bg-zinc-100 dark:!bg-zinc-700": isSelected,
        }
      )}
      onClick={() => addToSelectedTimezones(timezone)}
      onMouseOver={() => setSelectedTimezoneIndex(rowIndex)}
    >
      <p>{timezone.name}</p>
      <Time clock={timezone.clock} />
    </button>
  );
}
