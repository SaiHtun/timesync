import Controller from "./Controller";
import TimezoneSearch from "./TimezoneSearch";

export default function MenuBar() {
  return (
    <div className="mb-6 h-10 grid grid-cols-[1fr_300px] gap-2">
      <Controller />
      <TimezoneSearch />
    </div>
  );
}
