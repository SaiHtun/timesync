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
    <main className="my-4 flex flex-col gap-4 max-h-[800px] overflow-auto">
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
