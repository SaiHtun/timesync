import SelectedTimezones from "~/components/SelectedTimezones";
import Navbar from "./NavBar";
import SearchdTimezones from "~/components/SearchedTimezones";
import MenuBar from "./MenuBar";

export default function TimezonesBoard() {
  return (
    <main className="w-full h-full">
      <Navbar />
      <MenuBar />
      <div className="relative w-full mt-4">
        <SelectedTimezones />
        <SearchdTimezones />
      </div>
    </main>
  );
}
