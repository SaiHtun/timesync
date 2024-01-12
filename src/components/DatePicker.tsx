import Date from "./Date.1";
import { useAtom } from "jotai";
import { datesAtom } from "~/atoms/date";

export default function DatePicker() {
  const [dates] = useAtom(datesAtom);

  return (
    <div className="text-xs flex gap-2">
      {dates?.map((date, index) => {
        return <Date key={index} currentDate={date} />;
      })}
    </div>
  );
}
