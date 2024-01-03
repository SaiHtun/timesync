import { atomWithStorage } from "jotai/utils";
import { DialColors } from "~/constants/colorsMap";

export const dialColorWithLocalStorageAtom = atomWithStorage<DialColors>(
  "dialColor",
  "gray"
);
