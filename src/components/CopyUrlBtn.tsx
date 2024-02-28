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
        "flex items-center justify-center rounded-md primary_border hover:feature_bg dark:text-zinc-50 h-full w-[58px] px-3 shadow-sm text-zinc-800 transition-all ",
        {
          "!bg-green-500 !border-green-500/60 shadow-green-500/20 text-white hover:text-white dark:hover:text-zinc-50":
            isCopied,
        }
      )}
      onClick={handleClick}
    >
      {isCopied ? (
        <div className="flex items-center gap-2">
          <CopyCheck size={14} strokeWidth={2} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Copy size={11} strokeWidth={2} />
          <span className="text-[11px]">URL</span>
        </div>
      )}
    </button>
  );
}
