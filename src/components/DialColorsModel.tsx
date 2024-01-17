import { AnimatePresence, motion } from "framer-motion";
import { dialColors } from "~/constants/colorsMap";
import DialColor from "./DialColor";

interface IProps {
  isModelOpen: boolean;
}

export default function DialColorsModel({ isModelOpen }: IProps) {
  return (
    <AnimatePresence>
      {isModelOpen && (
        <motion.div
          id="colors-picker"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: 14 }}
          className="absolute left-0 top-8 p-2 grid grid-cols-3 grid-rows-2 justify-items-center w-[100px] primary_border bg-white dark:bg-zinc-800 gap-1 shadow-sm"
        >
          {dialColors.map((dialColor) => {
            return <DialColor key={dialColor.name} dialColor={dialColor} />;
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
