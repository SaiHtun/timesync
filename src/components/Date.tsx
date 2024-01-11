import { useAtom } from "jotai";
import { CurrentDate, currentDateAtom } from "~/atoms/date";
import { cn } from "~/utils/cn";

interface Props {
  date: CurrentDate;
}

export default function Date({ date }: Props) {
  const [dayOfWeek, monthAndDay] = date.name.split(", ");
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const [, numOfDay] = monthAndDay.split(" ");

  const isSelectedDate = date.name === currentDate.name;

  return (
    <button
      className={cn(
        "flex flex-col items-center transition-colors p-[2px] w-9 rounded-md primary_border hover:text-zinc-900 dark:hover:text-zinc-50",
        {
          "shadow-inner  text-zinc-400": !isSelectedDate,
        }
      )}
      onClick={() => setCurrentDate(date)}
    >
      <span>{numOfDay}</span>
      <span>{dayOfWeek}</span>
    </button>
  );
}
