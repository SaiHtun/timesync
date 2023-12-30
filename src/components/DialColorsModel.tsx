import { AnimatePresence, motion } from "framer-motion";
import { dialColors } from "~/constants/colorsMap";
import DialColor from "./DialColor";
import { cn } from "~/utils/cn";

export default function DialColorsModel({
  isModelOpen,
}: {
  isModelOpen: boolean;
}) {
  return (
    <AnimatePresence>
      {isModelOpen && (
        <motion.div
          initial={{ opacity: 0, translateY: "-10px" }}
          animate={{ opacity: 1, translateY: "8px" }}
          exit={{ opacity: 0, translateY: "-5px" }}
          className={cn(
            "p-2 grid grid-cols-3 grid-rows-2 w-fit h-fit primary_border primary_bg gap-1"
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
