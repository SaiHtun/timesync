import type { Timezone } from "~/utils/hooks/use-timezones";
import TimezoneRow from "./timezone-row";

interface Props {
  timezones: Timezone[];
  currentTimezoneIndex?: string;
}

export default function Timezones({ timezones }: Props) {
  return (
    <main className="flex flex-col max-h-[880px] w-full odd_childs absolute -z-1">
      {timezones.map((timezone) => (
        <TimezoneRow timezone={timezone} key={timezone.name} />
      ))}
    </main>
  );
}
