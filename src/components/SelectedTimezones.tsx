import { memo } from "react";
import TimezoneRow from "./SelectedTimezoneRow";
import { useSelectedTimezones } from "~/utils/hooks/use-timezones";

export default memo(function Timezones() {
  const selectedTimezones = useSelectedTimezones();

  return (
    <main className="flex flex-col max-h-[880px] w-full odd_childs absolute -z-1">
      {selectedTimezones.map((timezone, index) => (
        <TimezoneRow
          timezone={timezone}
          key={timezone.name}
          isHome={index === 0}
        />
      ))}
    </main>
  );
});
