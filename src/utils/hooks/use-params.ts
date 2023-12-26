import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsonParser } from "../index";

export function useParams<T>(key: string, value: T): T | null {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!searchParams.get(key)) {
      setSearchParams((pre) => {
        pre.append(key, JSON.stringify(value));
        return pre;
      });
    }
    const { err, data } = jsonParser<T>(searchParams.get(key)!);
    if (err !== null) {
      setSearchParams((pre) => {
        pre.set(key, JSON.stringify(value));
        return pre;
      });
    } else {
      setData(data);
    }
  }, []);

  return data;
}
