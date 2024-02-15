import DatePicker from "./DatePicker";
import DialColorsPicker from "./DialColorsPicker";
import HoursFormatBtn from "./HoursFormatBtn";
import Stats from "./Stats";

export default function Controller() {
  return (
    <div className="primary_bg primary_border rounded-md p-[4px] h-full flex gap-2 justify-between items-center">
      <div className="flex items-center h-full gap-2 ">
        <HoursFormatBtn />
        <DialColorsPicker />
      </div>
      <DatePicker />
      <Stats />
    </div>
  );
}
