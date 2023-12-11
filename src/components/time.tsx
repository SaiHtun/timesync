interface Props {
  clock: string;
}

export default function Time({ clock = "00:00 AM" }: Props) {
  const [time, amORpm] = clock.split(" ");
  const [hour, min] = time.split(":");

  return (
    <div>
      <p className="tabular-nums text-sm">
        <span>{hour}</span>
        <span className="animate-blinker text-md mx-[1px]">:</span>
        <span>{min}</span>
        <sup className="ml-1 text-[10px] primary_text-gray">{amORpm}</sup>
      </p>
    </div>
  );
}
