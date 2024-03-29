import { cn } from "~/utils/cn";
import Clock from "~/components/Clock";
import { useAtom } from "jotai";
import { searchedTimezoneIndexAtom } from "~/atoms/searched-timezone-index";
import { appendSelectedTimezonesAtom } from "~/atoms/selected-timezones";
import { hoursFormatAtom } from "~/atoms/hours-format";
import { motion } from "framer-motion";

interface IProps {
  timezone: ITimezone;
  currentTimezoneIndex: number;
}

export default function SearchedTimezoneRow({
  timezone,
  currentTimezoneIndex,
}: IProps) {
  const [searchTimezoneIndex, setSearchedTimezoneIndex] = useAtom(
    searchedTimezoneIndexAtom
  );
  const [hoursFormat] = useAtom(hoursFormatAtom);
  const [, appendSelectedTimezones] = useAtom(appendSelectedTimezonesAtom);

  function handleAdd() {
    appendSelectedTimezones();
  }

  const isSelected = searchTimezoneIndex === currentTimezoneIndex;

  return (
    <motion.div>
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md",
          { "!bg-zinc-100 dark:!bg-zinc-700 !rounded-none": isSelected }
        )}
        onClick={() => handleAdd()}
        onMouseMove={() => setSearchedTimezoneIndex(currentTimezoneIndex)}
      >
        <p className="text-sm flex items-center gap-1">
          <span>{timezone.name}</span>
          <span className="text-[10px] primary_text_gray">{timezone.abbr}</span>
        </p>
        <Clock clock={timezone[hoursFormat]} />
      </button>
    </motion.div>
  );
}
