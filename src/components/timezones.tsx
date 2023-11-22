import type { NormalisedTimezone } from "~/utils/timezones";
import TimezoneRow from "./timezone-row";

interface Props {
  timezones: NormalisedTimezone[];
  selectTimezoneIndex: number;
}

export default function Timezones({ timezones, selectTimezoneIndex }: Props) {
  return (
    <main className="my-4 flex flex-col gap-4">
      {timezones.map((timezone, index) => (
        <TimezoneRow
          timezone={timezone}
          key={index}
          selectTimezoneIndex={selectTimezoneIndex}
          timezoneIndex={index}
        />
      ))}
    </main>
  );
}
