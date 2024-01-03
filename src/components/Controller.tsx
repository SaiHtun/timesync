import DialColorsPicker from "./DialColorsPicker";
import HoursFormatBtn from "./HoursFormatBtn";

export default function Controller() {
  return (
    <div className="primary_bg primary_border rounded-md px-2 py-1 flex gap-2 items-center">
      <HoursFormatBtn />
      <DialColorsPicker />
    </div>
  );
}
