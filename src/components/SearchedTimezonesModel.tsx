import { useSearchedTimezones } from "~/utils/hooks/use-searched-timezones";
import SearchedTimezoneRow from "./SearchedTimezoneRow";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchedTimezones() {
  const searchedTimezones = useSearchedTimezones();

  return (
    <AnimatePresence>
      {searchedTimezones.length && (
        <motion.div
          id="searched-timezones"
          className="w-[400px] min-w-[180px] max-h-[440px] overflow-hidden odd_childs even_childs z-10 absolute top-0 right-0 shadow-md rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {searchedTimezones.map((tz, index) => {
            return (
              <SearchedTimezoneRow
                key={tz.name}
                timezone={tz}
                currentTimezoneIndex={index}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
