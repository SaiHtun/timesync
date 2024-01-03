import { atom } from "jotai";
import { DialColors } from "~/constants/colorsMap";

export const dialColorAtom = atom<DialColors>("gray");

export const setDialColorAtom = atom(
  (get) => get(dialColorAtom),
  (_, set, color: DialColors) => set(dialColorAtom, color)
);
