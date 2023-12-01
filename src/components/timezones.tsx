import type { NormalisedTimezone } from "~/utils/timezones";
import TimezoneRow from "./timezone-row";
import { Dispatch, SetStateAction } from "react";
interface Props {
  timezones: NormalisedTimezone[];
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
  currentTimezoneIndex?: string;
}

export default function Timezones({ timezones }: Props) {
  return (
    <main className="flex flex-col max-h-[880px] overflow-hidden w-full odd_childs absolute -z-1">
      {timezones.map((timezone) => (
        <TimezoneRow timezone={timezone} key={timezone.id} />
      ))}
    </main>
  );
}
