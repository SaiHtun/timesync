import type { NormalisedTimezone } from "~/utils/timezones";
import TimezoneRow from "./timezone-row";
import { Dispatch, SetStateAction } from "react";
interface Props {
  timezones: NormalisedTimezone[];
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
}

export default function Timezones({
  timezones,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
}: Props) {
  return (
    <main className="flex flex-col max-h-[880px] [&>*:nth-child(odd)]:bg-gray-100 [&>*:nth-child(odd)]:text-gray-900">
      {timezones.map((timezone, index) => (
        <TimezoneRow
          timezone={timezone}
          key={index}
          addToSelectedTimezones={addToSelectedTimezones}
          setSelectTimezoneIndex={setSelectTimezoneIndex}
        />
      ))}
    </main>
  );
}
