import TimezonesBoard from "./components/timezones-board";

function App() {
  return (
    <div className="h-screen w-screen dark:bg-zinc-900 dark:text-gray-100 py-20 overflow-scroll">
      <main className="max-sm:px-4 max-sm:w-[1120px] w-[1100px] h-full mx-auto">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
