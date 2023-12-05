import { NormalisedTimezone } from "~/utils/timezones";
import Time from "./time";
import { formatTimezone } from "~/utils/current-time";
import { cn } from "~/utils/cn";

interface Props {
  timezones: NormalisedTimezone[];
  addToSelectedTimezones: (timezone: NormalisedTimezone) => void;
  selectedTimezoneIndex: number;
}

export default function SearchedTimezones({
  timezones,
  addToSelectedTimezones,
  selectedTimezoneIndex,
}: Props) {
  return (
    <div className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute shadow-md rounded-md">
      {timezones.map((tz) => {
        const { clock } = formatTimezone(tz.now);
        const isSelected = timezones[selectedTimezoneIndex].id === tz.id;

        return (
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md hover:bg-zinc-100 dark:hover:!bg-zinc-700",
              {
                "!bg-zinc-100 dark:!bg-zinc-700": isSelected,
              }
            )}
            key={tz.id}
            onClick={() => addToSelectedTimezones(tz)}
          >
            <p>{tz.name}</p>
            <Time clock={clock} />
          </button>
        );
      })}
    </div>
  );
}
