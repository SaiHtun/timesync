import { useEffect } from "react";
import DateDial from "./DateDial";
import { useAtom } from "jotai";
import {
  datesAtom,
  readWriteDatesAtom,
  readWriteSelectedDateAtom,
} from "~/atoms/date";
import CalendarButton from "./CalendarButton";

export default function DatePicker() {
  const [dates, setDates] = useAtom(readWriteDatesAtom);
  const [selectedDate] = useAtom(readWriteSelectedDateAtom);
  const [originalDates] = useAtom(datesAtom);
  const foundDate = originalDates.find((d) => d === selectedDate);

  useEffect(() => {
    if (!foundDate) {
      setDates();
    }
  }, [dates]);

  return (
    <div className="text-xs flex gap-2">
      <CalendarButton />
      {dates?.map((date, index) => {
        return <DateDial key={index} date={date} />;
      })}
    </div>
  );
}
