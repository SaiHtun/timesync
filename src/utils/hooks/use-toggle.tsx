import { useState, useCallback, Dispatch, SetStateAction } from "react";

type UseToggleReturnType = [
  boolean,
  () => void,
  Dispatch<SetStateAction<boolean>>
];

export function useToggle(defaultValue?: boolean): UseToggleReturnType {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => setValue((x) => !x), []);

  return [value, toggle, setValue];
}
