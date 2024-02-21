import { useAtom } from "jotai";
import { readWriteTotalMeetingMinutesAtom } from "~/atoms/selected-timezones";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";

export default function MeetingMinutes() {
  const [totalMeetingMinutes] = useAtom(readWriteTotalMeetingMinutesAtom);

  if (!totalMeetingMinutes) return;

  return (
    <div className="flex items-center justify-between px-2">
      <ArrowLeftToLine size={13} className="text-zinc-400 dark:text-zinc-500" />
      <p className="text-xs">{totalMeetingMinutes}</p>
      <ArrowRightToLine
        size={13}
        className="text-zinc-400 dark:text-zinc-500"
      />
    </div>
  );
}
