import TimezonesBoard from "./components/timezones-board";

function App() {
  return (
    <div className="min-h-screen dark:bg-gray-800 dark:text-white py-20">
      <main className="max-sm:px-4 min-w-[600px] w-[1024px] mx-auto ">
        <TimezonesBoard />
      </main>
    </div>
  );
}

export default App;
