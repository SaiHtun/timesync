import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { CalendarDays } from "lucide-react";
import { isDatePickerModelOpenAtom } from "~/atoms/date";
import Calendar from "./Calendar";
import { cn } from "~/utils/cn";

export function CalendarButton() {
  const [isModelOpen, setIsModelOpen] = useAtom(isDatePickerModelOpenAtom);

  return (
    <div className="relative">
      <button
        className={cn(
          "primary_border h-full w-9 flex justify-center items-center primary_bg dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors ",
          { "bg-white text-zinc-900 dark:text-zinc-50": isModelOpen }
        )}
        onClick={() => setIsModelOpen(!isModelOpen)}
        id="calendar-btn"
      >
        <CalendarDays strokeWidth={1} size={26} />
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
