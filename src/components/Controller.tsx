import {
  getCurrentUserTimezoneName,
  getNextDay,
} from "~/utils/hooks/use-timezones";
import DialColorsPicker from "./DialColorsPicker";
import HoursFormatBtn from "./HoursFormatBtn";
import Stats from "./Stats";
import { arrayRange } from "../utils";
import { atom, useAtom } from "jotai";
import { cn } from "~/utils/cn";

const dateAtom = atom(getNextDay(getCurrentUserTimezoneName(), 0));

const setDateAtom = atom(
  (get) => get(dateAtom),
  (_, set, date: string) => set(dateAtom, date)
);

function DatePicker() {
  const currentTime = getCurrentUserTimezoneName();
  const dateArray = arrayRange(0, 3).map((num) => getNextDay(currentTime, num));

  return (
    <div className="text-xs flex gap-2">
      {dateArray.map((date, index) => (
        <Date key={index} date={date} />
      ))}
    </div>
  );
}

function Date({ date }: { date: string }) {
  const [dayOfWeek, monthAndDay] = date.split(", ");
  const [month, numOfDay] = monthAndDay.split(" ");
  const [currentDate, setDate] = useAtom(setDateAtom);

  return (
    <button
      className={cn(
        "flex flex-col items-center transition-colors p-[2px] w-9 rounded-md primary_border hover:text-zinc-900 dark:hover:text-zinc-50",
        {
          "shadow-inner  text-zinc-400": currentDate !== date,
        }
      )}
      onClick={() => setDate(date)}
    >
      <span>{numOfDay}</span>
      <span>{dayOfWeek}</span>
    </button>
  );
}

export default function Controller() {
  return (
    <div className="primary_bg primary_border rounded-md p-[6px] h-[50px] flex gap-2 justify-between items-center">
      <div className="flex items-center h-full gap-2 ">
        <HoursFormatBtn />
        <DialColorsPicker />
      </div>
      <DatePicker />
      <Stats />
    </div>
  );
}
