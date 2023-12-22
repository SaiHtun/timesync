import TimezoneRow from "./SelectedTimezoneRow";
import { useSelectedTimezones } from "~/utils/hooks/use-timezones";

export default function Timezones() {
  const selectedTimezones = useSelectedTimezones();

  return (
    <main className="flex flex-col max-h-[880px] w-full odd_childs absolute -z-1">
      {selectedTimezones.map((timezone) => (
        <TimezoneRow timezone={timezone} key={timezone.name} />
      ))}
    </main>
  );
}
