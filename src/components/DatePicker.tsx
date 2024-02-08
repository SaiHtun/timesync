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
      d.date.split(", ").slice(0, 3).join(", ") ===
      selectedDate.date.split(", ").slice(0, 3).join(", ")
  );

  const isDatesChanged = originalDates[0].date !== dates[0].date;

  useEffect(() => {
    if (isDatesChanged && !foundDate) {
      setDates();
    }
  }, [dates]);

  return (
    <div className="text-xs flex gap-2">
      <CalendarButton />
      {dates?.map((date, index) => {
        return <DateDial key={index} dial={date} />;
      })}
    </div>
  );
}
