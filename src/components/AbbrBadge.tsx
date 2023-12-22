interface Props {
  abbr: string;
}

export default function AbbrBadge({ abbr }: Props) {
  return (
    <sup className="ml-1 p-1 text-[11px] primary_border rounded-md primary_text_gray ">
      {abbr}
    </sup>
  );
}
