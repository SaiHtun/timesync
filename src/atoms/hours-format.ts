import { atom } from "jotai";

export type HoursFormat = "24" | "12";

export const hoursFormatAtom = atom<HoursFormat>("24");

export const toggleHoursFormatAtom = atom(null, (_, set) => {
  set(hoursFormatAtom, (pre) => (pre === "24" ? "12" : "24"));
});
