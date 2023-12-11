import { switchTheme, isDarkMode } from "~/utils/switch-theme";
import { Sun, Moon, Github } from "lucide-react";
import { useToggle } from "~/utils/hooks/use-toggle";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
}

function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className="hover:text-gray-400 transition-colors">
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
    <div className="flex items-center justify-between ">
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-bold">何时</h1>
        <h3 className="text-zinc-400">what time works for you?</h3>
      </div>
      <div className="flex items-center gap-3">
        <Button>
          <Github />
        </Button>
        <Button onClick={handleSwitchTheme}>
          {value ? <Sun color="rgb(255, 234, 0)" /> : <Moon />}
        </Button>
      </div>
    </div>
  );
}
