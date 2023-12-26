import { cn } from "~/utils/cn";
import type { Timezone } from "~/utils/hooks/use-timezones";
import Clock from "~/components/Clock";
import { useAtom } from "jotai";
import { addSelectedTimezonesAtom } from "~/atoms/selected-timezones";
import { useSearchParams, SetURLSearchParams } from "react-router-dom";
import { jsonParser } from "~/utils/index";

interface Props {
  timezone: Timezone;
}

function appendTimezoneNameToUrl(
  timezoneName: string,
  [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams]
) {
  const timezonesName = searchParams.get("timezones") || "[]";

  const { err, data: parsedTimezonesName } =
    jsonParser<string[]>(timezonesName);

  if (err === null) {
    if (!parsedTimezonesName.includes(timezoneName)) {
      parsedTimezonesName.push(timezoneName);
      setSearchParams({ timezones: JSON.stringify(parsedTimezonesName) });
    }
  }
}

export default function SearchedTimezoneRow({ timezone }: Props) {
  const [, addSelectedTimezones] = useAtom(addSelectedTimezonesAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  function add(timezone: Timezone) {
    addSelectedTimezones(timezone);
    appendTimezoneNameToUrl(timezone.name, [searchParams, setSearchParams]);
  }

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md "
      )}
      onClick={() => add(timezone)}
      // onMouseOver={() => setSelectedTimezoneIndex(rowIndex)}
    >
      <p className="flex items-center gap-1">
        <span>{timezone.name}</span>
        <span className="text-xs primary_text_gray">{timezone.abbr}</span>
      </p>
      <Clock clock={timezone.clock} />
    </button>
  );
}
