import { useAtom } from "jotai";
import { readWriteSelectedDateAtom } from "~/atoms/date";
import { cn } from "~/utils/cn";
interface IProps {
  date: string;
}

export default function DateDial({ date }: IProps) {
  const [dayOfWeek, monthAndDay] = date.split(", ");
  const [selectedDate, setSelectedDate] = useAtom(readWriteSelectedDateAtom);
  const [, numOfDay] = monthAndDay.split(" ");

  function dateSlicer(dateStr: string) {
    return dateStr.split(", ").slice(0, 3).join(", ");
  }

  const isSelectedDate = dateSlicer(date) === dateSlicer(selectedDate);

  function handleClick() {
    setSelectedDate(date);
  }

  return (
    <button
      className={cn(
        "flex flex-col items-center transition-colors p-[2px] w-9 rounded-md primary_border hover:text-zinc-900 dark:hover:text-zinc-50",
        {
          "shadow-inner  text-zinc-400": !isSelectedDate,
        }
      )}
      onClick={handleClick}
    >
      <span>{numOfDay}</span>
      <span>{dayOfWeek}</span>
    </button>
  );
}
