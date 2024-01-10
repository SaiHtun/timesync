import Date from "./Date";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { currentDateAtom, datesAtom } from "~/atoms/date";

export default function DatePicker() {
  const [dates] = useAtom(datesAtom);
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);

  useEffect(() => {
    setCurrentDate(dates[0]);
  }, []);

  return (
    <div className="text-xs flex gap-2">
      {dates?.map((date, index) => {
        const isSelectedDate = date.date === currentDate.date;
        return (
          <Date
            key={index}
            currentDate={date}
            isSelectedDate={isSelectedDate}
          />
        );
      })}
    </div>
  );
}
