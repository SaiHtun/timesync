import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DialColors, textColorsMap } from "~/constants/colorsMap";

export const dialColorWithLocalStorageAtom = atomWithStorage<DialColors>(
  "dialColor",
  "gray"
);

export const textColorSchemeAtom = atom((get) => {
  const currentColor = get(dialColorWithLocalStorageAtom);
  return textColorsMap[currentColor];
});
