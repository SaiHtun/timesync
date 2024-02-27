import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import { cn } from "~/utils/cn";

export default function CopyUrlBtn() {
  const [isCopied, setCopied] = useState(false);

  function copyUrl() {
    if (window) {
      const url = window.location.href;
      window.navigator.clipboard.writeText(url);
    }
  }

  function handleClick() {
    copyUrl();
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-md bg-zinc-200 h-full w-[64px] px-3 shadow-sm text-zinc-800 transition-all hover:text-zinc-800/70 dark:hover:text-zinc-200/70",
        {
          "bg-green-500 !border-green-500/60 shadow-green-500/20 text-white hover:text-white dark:hover:text-zinc-50":
            isCopied,
        }
      )}
      onClick={handleClick}
    >
      {isCopied ? (
        <div className="flex items-center gap-2">
          <CopyCheck size={18} strokeWidth={2} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Copy size={11} strokeWidth={3} />
          <span className="text-xs font-semibold">URL</span>
        </div>
      )}
    </button>
  );
}
