import { useAtom } from "jotai";
import { selectedDateAtom } from "~/atoms/date";
import { cn } from "~/utils/cn";
interface IProps {
  dial: {
    name: string;
    date: string;
  };
}

export default function DateDial({ dial }: IProps) {
  const [dayOfWeek, monthAndDay] = dial.date.split(", ");
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [, numOfDay] = monthAndDay.split(" ");
  // const [searchParams, setSearchParams] = useSearchParams();

  function dateSlicer(dateStr: string) {
    return dateStr.split(", ").slice(0, 3).join(", ");
  }

  const isSelectedDate =
    dateSlicer(dial.date) === dateSlicer(selectedDate.date);

  function handleClick() {
    setSelectedDate(dial);
    // reCaculateTimeDials(date);
    // setSearchParams((prevParams) => {
    //   if (searchParams.get("selectedDate")) {
    //     prevParams.set("selectedDate", date);
    //   } else {
    //     prevParams.append("selectedDate", date);
    //   }
    //   return prevParams;
    // });
  }

  // function reCaculateTimeDials(date: string) {
  //   setSelectedTimezones((prevTimezones) => {
  //     const homeTimezone = prevTimezones[0];
  //     return prevTimezones.map((tz, index) => {
  //       if (index === 0) {
  //         const newDate = date.split(", ").slice(0, 3).join(", ");
  //         console.log("ND::", newDate);
  //         tz.date = newDate;
  //         tz.timeDials.map((td) => (td.date = newDate));
  //         return tz;
  //       }

  //       const formatStr = "eee, MMM d, y";
  //       const newDate = formatInTimeZone(new Date(date), tz.name, formatStr);
  //       tz.date = newDate;

  //       tz.timeDials.map((td, index) => {
  //         const { date, timeDials, abbr } = homeTimezone;
  //         const dial = timeDials[index];

  //         const hour = isDecimal(dial.hour12)
  //           ? `${Math.floor(dial.hour12)}:30`
  //           : `${dial.hour12}:00`;

  //         const d = `${date}, ${hour} ${dial.timeMeridian}, ${abbr}`;
  //         td.date = formatInTimeZone(new Date(d), tz.name, formatStr);
  //       });

  //       return tz;
  //     });
  //   });
  // }

  return (
    <button
      className={cn(
        "flex flex-col items-center transition-colors p-[2px] w-9 rounded-md primary_border hover:text-zinc-900 dark:hover:text-zinc-50",
        {
          "shadow-inner  text-zinc-400": !isSelectedDate,
        }
      )}
      onClick={handleClick}
    >
      <span>{numOfDay}</span>
      <span>{dayOfWeek}</span>
    </button>
  );
}
