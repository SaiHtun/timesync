import { atom } from "jotai";
import {
  keydownAddTimezoneIndexAtom,
  searchedTimezoneIndexAtom,
} from "./searched-timezone-index";
import { SetURLSearchParams } from "react-router-dom";
import { appendTimezoneNameToUrl } from "~/utils/hooks/use-timezones-params";
import { searchTimezoneNameAtom } from "./search-timezone-name";
import { appendSelectedTimezonesAtom } from "./selected-timezones";

export const searchedTimezonesAtom = atom<ITimezone[]>([]);

export const searchedTimezonesLengthAtom = atom(
  (get) => get(searchedTimezonesAtom).length
);

export const searchedSelectedTimezoneAtom = atom((get) => {
  return get(searchedTimezonesAtom)[get(searchedTimezoneIndexAtom)];
});

type KeydownArgs = {
  e: React.KeyboardEvent<HTMLDivElement>;
  useSearchParamsItems: [
    searchParams: URLSearchParams,
    setSearchParams: SetURLSearchParams
  ];
};

export const handleKeydownSearchedTimezoneAtom = atom(
  null,
  (get, set, { e, useSearchParamsItems }: KeydownArgs) => {
    const [searchParams, setSearchParams] = useSearchParamsItems;

    if (e.code === "Enter") {
      appendTimezoneNameToUrl(get(searchedSelectedTimezoneAtom).name, [
        searchParams,
        setSearchParams,
      ]);
      set(appendSelectedTimezonesAtom);
    } else if (e.code === "Escape") {
      set(searchTimezoneNameAtom, "");
    }

    set(keydownAddTimezoneIndexAtom, e);
  }
);
