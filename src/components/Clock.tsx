interface Props {
  clock?: string;
}

export default function Clock({ clock = "00:00 AM" }: Props) {
  const [hoursMins, amORpm] = clock.split(" ");
  const [hour, min] = hoursMins.split(":");

  return (
    <p className="tabular-nums text-xs">
      <span>{hour}</span>
      <span className="animate-blinker text-md mx-[1px]">:</span>
      <span>{min}</span>
      <span className="ml-1 text-[10px] primary_text_gray">{amORpm}</span>
    </p>
  );
}
