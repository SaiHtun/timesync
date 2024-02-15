import { useEffect } from "react";
import DateDial from "./DateDial";
import { useAtom } from "jotai";
import { datesAtom, readWriteDatesAtom, selectedDateAtom } from "~/atoms/date";
import CalendarButton from "./CalendarButton";

export default function DatePicker() {
  const [dates, setDates] = useAtom(readWriteDatesAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [originalDates] = useAtom(datesAtom);
  const foundDate = originalDates.find(
    (d) =>
      d.split(", ").slice(0, 3).join(", ") ===
      selectedDate.split(", ").slice(0, 3).join(", ")
  );

  const isDatesChanged = originalDates[0] !== dates[0];

  useEffect(() => {
    if (isDatesChanged && !foundDate) {
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
