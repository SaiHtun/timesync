import { switchTheme, isDarkMode } from "~/utils/switch-theme";
import { Sun, MoonStar } from "lucide-react";
import { useToggle } from "~/utils/hooks/use-toggle";
import GithubLink from "./GithubLink";

export default function Navbar() {
  const [value, toggle] = useToggle(isDarkMode());

  function handleSwitchTheme() {
    switchTheme();
    toggle();
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-end gap-2">
        <h1 className={"text-4xl font-bold"}>Timesync</h1>
        <h3 className="text-zinc-400">what time works for you?</h3>
      </div>
      <div className="flex items-center gap-3">
        <GithubLink />
        <button
          className="hover:text-gray-400 transition-colors primary_border rounded-full p-2 shadow-sm bg-white dark:bg-zinc-900"
          onClick={handleSwitchTheme}
          id="theme-btn"
        >
          {value ? (
            <Sun size={20} className="pointer-events-none" />
          ) : (
            <MoonStar size={20} className="pointer-events-none" />
          )}
        </button>
      </div>
    </div>
  );
}
