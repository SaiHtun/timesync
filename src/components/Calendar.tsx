import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ClassValue } from "clsx";
import { cn } from "~/utils/cn";
import { useAtom } from "jotai";
import { setSelectedDateAtom, startedDateAtom } from "~/atoms/date";
import { format } from "date-fns";

interface IProps {
  classNames?: ClassValue;
}

export default function Calendar({ classNames }: IProps) {
  const [startedDate, setStartedDate] = useAtom(startedDateAtom);
  const [, setSelectedDate] = useAtom(setSelectedDateAtom);

  function handleDayClick(date: Date) {
    setStartedDate(date);
    const newDate = format(date, "eee, MMM d, y");
    setSelectedDate(newDate);
  }

  return (
    <DayPicker
      selected={startedDate}
      onDayClick={handleDayClick}
      id="calendar"
      showOutsideDays
      className={cn(
        "p-3 rounded-md primary_border shadow-sm w-fit bg-white dark:bg-zinc-800",
        classNames
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 primary_border hover:!bg-zinc-200 dark:!bg-zinc-900 transition-colors",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell: "primary_text_gray rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm cursor-pointer",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:!bg-zinc-100 rounded-md transition-colors flex justify-center items-center",
        day_today: "bg-zinc-200 rounded-md",
        day_selected: "bg-zinc-900 text-zinc-50 pointer-events-none",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: () => (
          <ChevronLeft className="w-full h-full" strokeWidth={1} />
        ),
        IconRight: () => (
          <ChevronRight className="w-full h-full" strokeWidth={1} />
        ),
      }}
    />
  );
}
