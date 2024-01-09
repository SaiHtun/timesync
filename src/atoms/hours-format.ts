import { atom } from "jotai";

export type HoursFormat = "hour24" | "hour12";

export const hoursFormatAtom = atom<HoursFormat>("hour24");

export const toggleHoursFormatAtom = atom(null, (_, set) => {
  set(hoursFormatAtom, (pre) => (pre === "hour24" ? "hour12" : "hour24"));
});
