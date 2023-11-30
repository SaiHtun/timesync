import type { NormalisedTimezone } from "~/utils/timezones";
import TimezoneRow from "./timezone-row";
import { Dispatch, SetStateAction } from "react";
interface Props {
  timezones: NormalisedTimezone[];
  selectTimezoneIndex?: number;
  isSelectedTimezones?: boolean;
  addToSelectedTimezones?: (timezone: NormalisedTimezone) => void;
  setSelectTimezoneIndex?: Dispatch<SetStateAction<number>>;
}

export default function Timezones({
  timezones,
  selectTimezoneIndex,
  isSelectedTimezones,
  addToSelectedTimezones,
  setSelectTimezoneIndex,
}: Props) {
  return (
    <main className="flex flex-col gap-2 max-h-[880px] [&>*:nth-child(odd)]:bg-gray-100 text-gray-900">
      {timezones.map((timezone, index) => (
        <TimezoneRow
          timezone={timezone}
          key={index}
          isSelectedTimezones={isSelectedTimezones}
          tzIndex={index}
          selectTimezoneIndex={selectTimezoneIndex}
          addToSelectedTimezones={addToSelectedTimezones}
          setSelectTimezoneIndex={setSelectTimezoneIndex}
        />
      ))}
    </main>
  );
}
