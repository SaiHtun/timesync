interface Props {
  clock: string;
}

export default function Time({ clock }: Props) {
  // const [time, amORpm] = clock?.trim().split(" ");
  // const [hour, min] = time.split(":");

  return (
    <div>
      <p className="tabular-nums text-sm">
        {clock}
        {/* <span>{hour}</span>
        <span className="animate-blinker text-md mx-[1px]">:</span>
        <span>{min}</span>
        <sup className="text-[10px] text-gray-400">{amORpm}</sup> */}
      </p>
    </div>
  );
}
