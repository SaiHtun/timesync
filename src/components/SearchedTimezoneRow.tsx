import { cn } from "~/utils/cn";
import type { Timezone } from "~/utils/hooks/use-timezones";
import Clock from "~/components/Clock";
import { useAtom } from "jotai";
import { useSearchParams } from "react-router-dom";
import { appendTimezoneNameToUrl } from "~/utils/hooks/use-params";
import { searchedTimezoneIndexAtom } from "~/atoms/searched-timezone-index";

interface Props {
  timezone: Timezone;
  currentTimezoneIndex: number;
}

export default function SearchedTimezoneRow({
  timezone,
  currentTimezoneIndex,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTimezoneIndex, setSearchedTimezoneIndex] = useAtom(
    searchedTimezoneIndexAtom
  );

  const isSelected = searchTimezoneIndex === currentTimezoneIndex;

  function handleAddTimezones(timezone: Timezone) {
    appendTimezoneNameToUrl(timezone.name, [searchParams, setSearchParams]);
  }

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md",
        { "!bg-zinc-100 dark:!bg-zinc-700": isSelected }
      )}
      onClick={() => handleAddTimezones(timezone)}
      onMouseMove={() => setSearchedTimezoneIndex(currentTimezoneIndex)}
    >
      <p className="flex items-center gap-1">
        <span>{timezone.name}</span>
        <span className="text-xs primary_text_gray">{timezone.abbr}</span>
      </p>
      <Clock clock={timezone.clock} />
    </button>
  );
}
