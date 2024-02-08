import { atom } from "jotai";
import { atomWithHash } from "jotai-location";
import { getCurrentUserTimezoneName } from "~/utils/timezones";
import { arrangeHomeFirstTimezonesName } from "~/utils/timezones";

export const urlTimezonesNameAtom = atomWithHash("timezones", [
  getCurrentUserTimezoneName(),
]);

export const readUrlTimezonesNameAtom = atom((get) => {
  return arrangeHomeFirstTimezonesName(get(urlTimezonesNameAtom));
});

export const popUrlTimezonesNameAtom = atom(
  null,
  (get, set, timezoneName: string) => {
    const timezonesName = get(urlTimezonesNameAtom);
    const idx = timezonesName.findIndex((tz) => tz === timezoneName);
    timezonesName.splice(idx, 1);

    set(urlTimezonesNameAtom, timezonesName);
  }
);
