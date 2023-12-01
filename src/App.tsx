import TimezonesBoard from "./components/timezones-board";

function App() {
  return (
    <div className="min-h-screen  dark:bg-zinc-900 dark:text-gray-100 py-20">
      <main className="max-sm:px-4 min-w-[600px] w-[1024px] mx-auto ">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
