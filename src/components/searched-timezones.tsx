import type { Timezone } from "~/utils/hooks/use-timezones";
import SearchedTimezoneRow from "./searched-timezone-row";

interface Props {
  timezones: Timezone[];
  addToSelectedTimezones: (timezone: Timezone) => void;
  selectedTimezoneIndex: number;
  setSelectedTimezoneIndex: (index: number) => void;
}

export default function SearchedTimezones({
  timezones,
  addToSelectedTimezones,
  selectedTimezoneIndex,
  setSelectedTimezoneIndex,
}: Props) {
  return (
    <div className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute right-0 shadow-md rounded-md">
      {timezones.map((tz, index) => (
        <SearchedTimezoneRow
          key={tz.name}
          rowIndex={index}
          setSelectedTimezoneIndex={setSelectedTimezoneIndex}
          timezone={tz}
          addToSelectedTimezones={addToSelectedTimezones}
          isSelected={timezones[selectedTimezoneIndex].name === tz.name}
        />
      ))}
    </div>
  );
}
