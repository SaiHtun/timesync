import type { NormalisedTimezone } from "~/utils/timezones";
import TimezoneRow from "./timezone-row";
import { FuseResult } from "fuse.js";
interface Props {
  timezones: FuseResult<NormalisedTimezone>[];
  selectTimezoneIndex?: number;
  isSelectedTimezones?: boolean;
}

export default function Timezones({
  timezones,
  selectTimezoneIndex = 0,
  isSelectedTimezones,
}: Props) {
  return (
    <main className="my-4 flex flex-col gap-4">
      {timezones.map(({ item, refIndex }, index) => (
        <TimezoneRow
          timezone={item}
          key={refIndex}
          isSelected={index === selectTimezoneIndex && !isSelectedTimezones}
        />
      ))}
    </main>
  );
}
