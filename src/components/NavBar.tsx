import { switchTheme, isDarkMode } from "~/utils/switch-theme";
import { Sun, MoonStar, Github } from "lucide-react";
import { useToggle } from "~/utils/hooks/use-toggle";
import { ButtonHTMLAttributes } from "react";
import { cn } from "~/utils/cn";
import { ClassValue } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  twClassList?: ClassValue;
  children: JSX.Element;
}

function Button({ twClassList, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "hover:text-gray-400 transition-colors primary_border rounded-full p-2 shadow-sm",
        twClassList
      )}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const [value, toggle] = useToggle(isDarkMode());

  function handleSwitchTheme() {
    switchTheme();
    toggle();
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-2">
        <h1 className={"text-4xl font-bold"}>何时</h1>
        <h3 className="text-zinc-400">what time works for you?</h3>
      </div>
      <div className="flex items-center gap-3">
        <Button>
          <Github size={20} />
        </Button>
        <Button onClick={handleSwitchTheme} id="theme-btn">
          {value ? (
            <Sun size={20} className="pointer-events-none" />
          ) : (
            <MoonStar size={20} className="pointer-events-none" />
          )}
        </Button>
      </div>
    </div>
  );
}
