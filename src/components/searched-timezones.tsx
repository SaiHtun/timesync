import {
  NormalisedTimezone,
  type TimezoneFormatType,
} from "~/utils/hooks/use-timezones";
import SearchedTimezoneRow from "./searched-timezone-row";

interface Props {
  timezones: NormalisedTimezone[];
  addToSelectedTimezones: (timezone: NormalisedTimezone) => void;
  selectedTimezoneIndex: number;
  timezoneFormat: TimezoneFormatType;
  setSelectedTimezoneIndex: (index: number) => void;
}

export default function SearchedTimezones({
  timezones,
  addToSelectedTimezones,
  selectedTimezoneIndex,
  timezoneFormat,
  setSelectedTimezoneIndex,
}: Props) {
  return (
    <div className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute right-0 shadow-md rounded-md">
      {timezones.map((tz, index) => (
        <SearchedTimezoneRow
          key={tz.id}
          rowIndex={index}
          setSelectedTimezoneIndex={setSelectedTimezoneIndex}
          timezoneFormat={timezoneFormat}
          timezone={tz}
          addToSelectedTimezones={addToSelectedTimezones}
          isSelected={timezones[selectedTimezoneIndex].id === tz.id}
        />
      ))}
    </div>
  );
}
