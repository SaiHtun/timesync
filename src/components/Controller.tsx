import CopyUrlBtn from "./CopyUrlBtn";
import DatePicker from "./DatePicker";
import DialColorsPicker from "./DialColorsPicker";
import HoursFormatBtn from "./HoursFormatBtn";
import MeetingMinutes from "./MeetingMinutes";

export default function Controller() {
  return (
    <div className="primary_bg primary_border rounded-md p-[4px] h-full grid grid-cols-[340px_1fr]">
      <div className="grid grid-cols-[1fr_160px]">
        <div className="flex h-full items-center gap-2 ">
          <HoursFormatBtn />
          <DialColorsPicker />
        </div>
        <MeetingMinutes />
      </div>
      <div className="flex justify-between items-center pl-2">
        <DatePicker />
        <CopyUrlBtn />
      </div>
    </div>
  );
}
