import { atom } from "jotai";
import { Timezone } from "~/utils/hooks/use-timezones";

export const searchedTimezonesAtom = atom<Timezone[]>([]);
