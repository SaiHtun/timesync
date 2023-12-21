import type { Timezone, TimezoneFormatType } from "~/utils/hooks/use-timezones";
import TimezoneRow from "./timezone-row";

interface Props {
  timezones: Timezone[];
  currentTimezoneIndex?: string;
  timezoneFormat: TimezoneFormatType;
}

export default function Timezones({ timezones, timezoneFormat }: Props) {
  return (
    <main className="flex flex-col max-h-[880px] w-full odd_childs absolute -z-1">
      {timezones.map((timezone) => (
        <TimezoneRow
          timezone={timezone}
          key={timezone.name}
          timezoneFormat={timezoneFormat}
        />
      ))}
    </main>
  );
}
