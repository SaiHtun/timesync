import Date from "./Date";
import { useAtom } from "jotai";
import { datesAtom } from "~/atoms/date";
import { CalendarButton } from "./CalendarButton";

export default function DatePicker() {
  const [dates] = useAtom(datesAtom);

  return (
    <div className="text-xs flex gap-2">
      <CalendarButton />
      {dates?.map((date, index) => {
        return <Date key={index} currentDate={date} />;
      })}
    </div>
  );
}
