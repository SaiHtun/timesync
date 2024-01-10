import { useAtom } from "jotai";
import { CurrentDate, setCurrentDateAtom } from "~/atoms/date";
import { cn } from "~/utils/cn";

interface Props {
  currentDate: CurrentDate;
  isSelectedDate: boolean;
}

export default function Date({ currentDate, isSelectedDate }: Props) {
  const [dayOfWeek, monthAndDay] = currentDate.date.split(", ");
  const [, numOfDay] = monthAndDay.split(" ");
  const [, setCurrentDate] = useAtom(setCurrentDateAtom);

  return (
    <button
      className={cn(
        "flex flex-col items-center transition-colors p-[2px] w-9 rounded-md primary_border hover:text-zinc-900 dark:hover:text-zinc-50",
        {
          "shadow-inner  text-zinc-400": !isSelectedDate,
        }
      )}
      onClick={() => setCurrentDate(currentDate)}
    >
      <span>{numOfDay}</span>
      <span>{dayOfWeek}</span>
    </button>
  );
}
