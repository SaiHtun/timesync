import { useState } from "react";
import { format } from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Example() {
  const [selected, setSelected] = useState<Date>();

  console.log("S::", selected);

  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, "PP")}.</p>;
  }
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      // footer={footer}
      modifiersClassNames={{
        today: "text-red-400",
        selected: "bg-zinc-200 text-zinc-900 rounded-md",
      }}
      classNames={{
        head: "text-blue-200",
        button: "rounded-md w-8 h-8 hover:bg-blue-100",
        button_reset: "",
        cell: "p-[1px] m-0 ",
        day: "p-0",
        caption: "text-center mb-4",
        caption_label: "text-[16px] text-red-400",
        nav_button_next: "w-6 h-6 absolute right-4 top-4 primary_border",
        nav_button_previous: "w-6 h-6 absolute left-4 top-4 primary_border",
      }}
      showOutsideDays
      captionLayout="dropdown"
      className="primary_border p-4 w-fit h-fit text-sm relative"
    />
  );
}
