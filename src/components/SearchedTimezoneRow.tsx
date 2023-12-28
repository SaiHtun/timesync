import { cn } from "~/utils/cn";
import type { Timezone } from "~/utils/hooks/use-timezones";
import Clock from "~/components/Clock";
import { useAtom } from "jotai";
import { addSelectedTimezonesAtom } from "~/atoms/selected-timezones";
import { useSearchParams } from "react-router-dom";
import { appendTimezoneNameToUrl } from "~/utils/hooks/use-params";

interface Props {
  timezone: Timezone;
  isSelected: boolean;
}

export default function SearchedTimezoneRow({ timezone, isSelected }: Props) {
  const [, addSelectedTimezones] = useAtom(addSelectedTimezonesAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  function handleAddTimezones(timezone: Timezone) {
    addSelectedTimezones(timezone);
    appendTimezoneNameToUrl(timezone.name, [searchParams, setSearchParams]);
  }

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md hover:bg-zinc-100 dark:hover:bg-zinc-700 ",
        { "!bg-zinc-100 dark:!bg-zinc-700": isSelected }
      )}
      onClick={() => handleAddTimezones(timezone)}
    >
      <p className="flex items-center gap-1">
        <span>{timezone.name}</span>
        <span className="text-xs primary_text_gray">{timezone.abbr}</span>
      </p>
      <Clock clock={timezone.clock} />
    </button>
  );
}
