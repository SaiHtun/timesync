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
    <div className="flex items-center justify-between w-full">
      <h1 className="text-center text-4xl font-bold">何时</h1>
      <div className="flex items-center gap-3">
        <Button>
          <Github />
        </Button>
        <Button onClick={handleSwitchTheme}>
          {value ? <Moon /> : <Sun />}
        </Button>
      </div>
    </div>
  );
}
