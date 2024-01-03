import { AnimatePresence, motion } from "framer-motion";
import { dialColors } from "~/constants/colorsMap";
import DialColor from "./DialColor";
import { cn } from "~/utils/cn";

interface Props {
  isModelOpen: boolean;
}

export default function DialColorsModel({ isModelOpen }: Props) {
  return (
    <AnimatePresence>
      {isModelOpen && (
        <motion.div
          id="colors-picker"
          initial={{ opacity: 0, translateY: "-10px" }}
          animate={{ opacity: 1, translateY: "14px" }}
          exit={{ opacity: 0, translateY: "-5px" }}
          className={cn(
            "absolute left-0 top-8 p-2 grid grid-cols-3 grid-rows-2 justify-items-center w-[100px] primary_border primary_bg gap-1 shadow-md"
          )}
        >
          {dialColors.map((dialColor) => {
            return <DialColor key={dialColor.name} dialColor={dialColor} />;
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
