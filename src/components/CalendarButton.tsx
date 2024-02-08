import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { Calendar as CalendarIcon } from "lucide-react";
import { isDatePickerModelOpenAtom, startedMonthAtom } from "~/atoms/date";
import Calendar from "./Calendar";
import { cn } from "~/utils/cn";

export default function CalendarButton() {
  const [isModelOpen, setIsModelOpen] = useAtom(isDatePickerModelOpenAtom);
  const [startedMonth] = useAtom(startedMonthAtom);

  return (
    <div className="relative">
      <button
        className={cn(
          "group relative primary_border h-full w-9 flex justify-center items-center primary_bg dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors ",
          { "bg-white text-zinc-900 dark:text-zinc-50": isModelOpen }
        )}
        onClick={() => setIsModelOpen(!isModelOpen)}
        id="calendar-btn"
      >
        <span
          className={cn(
            "absolute left-[7.5px] top-[15px] text-[10px] text-red-400 dark:text-red-600 dark:group-hover:text-red-400 group-hover:text-red-600 font-semibold",
            {
              "text-red-600 dark:text-red-400": isModelOpen,
            }
          )}
        >
          {startedMonth}
        </span>
        <CalendarIcon strokeWidth={1} size={32} />
      </button>
      <AnimatePresence>
        {isModelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 6 }}
            exit={{ opacity: 0, y: 0 }}
            className="absolute z-10 -left-3"
          >
            <Calendar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
