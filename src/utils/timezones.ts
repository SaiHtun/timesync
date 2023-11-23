import timezones, { type Timezone } from "timezones.json";

export interface NormalisedTimezone {
  name: string;
  offset: number;
}

function normalisedTimezones(timezones: Timezone[]): NormalisedTimezone[] {
  return timezones.flatMap((timezone) =>
    timezone.utc.map((tz) => ({
      name: tz.replace("_", " "),
      offset: timezone.offset,
    }))
  );
}

export default normalisedTimezones(timezones);
