import DialColorsPicker from "./DialColorsPicker";
import HoursFormatBtn from "./HoursFormatBtn";

export default function Controller() {
  return (
    <div className="primary_bg primary_border relative rounded-md px-2 py-1 flex gap-4 items-center ">
      <HoursFormatBtn />
      <DialColorsPicker />
    </div>
  );
}
