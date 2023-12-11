import { cn } from "~/utils/cn";
import { formatTimezone } from "~/utils/current-time";
import {
  NormalisedTimezone,
  TimezoneFormatType,
} from "~/utils/hooks/use-timezones";
import Time from "./time";

interface Props {
  timezone: NormalisedTimezone;
  timezoneFormat: TimezoneFormatType;
  addToSelectedTimezones: (timezone: NormalisedTimezone) => void;
  isSelected: boolean;
  setSelectedTimezoneIndex: (index: number) => void;
  rowIndex: number;
}

export default function SearchedTimezoneRow({
  timezone,
  timezoneFormat,
  addToSelectedTimezones,
  isSelected,
  setSelectedTimezoneIndex,
  rowIndex,
}: Props) {
  const { clock } = formatTimezone(timezone.now, timezoneFormat);

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
      <Time clock={clock} />
    </button>
  );
}
