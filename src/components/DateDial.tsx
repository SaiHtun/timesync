import { useAtom } from "jotai";
import { selectedDateAtom } from "~/atoms/date";
import { cn } from "~/utils/cn";
interface IProps {
  dial: {
    name: string;
    date: string;
  };
}

export default function DateDial({ dial }: IProps) {
  const [dayOfWeek, monthAndDay] = dial.date.split(", ");
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [, numOfDay] = monthAndDay.split(" ");

  function dateSlicer(dateStr: string) {
    return dateStr.split(", ").slice(0, 3).join(", ");
  }

  const isSelectedDate =
    dateSlicer(dial.date) === dateSlicer(selectedDate.date);

  function handleClick() {
    setSelectedDate(dial);
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
