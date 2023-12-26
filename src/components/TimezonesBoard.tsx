import SelectedTimezones from "~/components/SelectedTimezones";
import Navbar from "./NavBar";
import SearchdTimezones from "~/components/SearchedTimezones";
import MenuBar from "./MenuBar";

export default function TimezonesBoard() {
  return (
    <>
      <Navbar />
      <MenuBar />
      <main className="relative w-full mt-4">
        <SelectedTimezones />
        <SearchdTimezones />
      </main>
    </>
  );
}
