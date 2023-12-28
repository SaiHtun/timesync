export function arrayRange(start: number, stop: number, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );
}

type JsonParserReturnType<T> =
  | {
      err: null;
      data: T;
    }
  | {
      err: string;
      data: null;
    };

export function jsonParser<T>(value: string): JsonParserReturnType<T> {
  try {
    const parsedJson = JSON.parse(value) as T;
    return { err: null, data: parsedJson };
  } catch (e) {
    let errorMessage = `Error parsing the input value: ${value}`;
    if (e instanceof Error) {
      errorMessage = `Error parsing JSON: ${e.message}`;
      console.error(errorMessage);
    }

    return { err: errorMessage, data: null };
  }
}
