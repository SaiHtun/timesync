[] redesign
[x] jerusalem, Mbabane: new-date format is not correct
[] introduce jotai
  [] selectedTimezones ( do we actually need "useTimezones" state for "searchedTimezone" coz "Fuss" will derived)
  [] handleKeyboard -> selectIndex
  [] click anywhere to reset the state
  [] localStorage for "SelectedTimezones"
  [] "Home" state. Should be able to set any place to "Home", then recalculate the "time diffs".

[] splice "timezones" to cal lastHour and newStartHour to split the date wiz better looking "padding + roundex corner"
  [] coloring -> dawn/afternoon/down
  [] better "am/pm" UI

[] re-arranged components


[] "date-fns-tz", for working with timezone offset

**Last**

[] URL binding
[] drag/drops
  [] remove timezone via slide-left drop
[] timezone length count. ( 1/10 )
[] user manual




**Today Ideals**

- replace "timezone.json" with "date-fns-tz" that support native browser "timezones" and parsing.
  - accurate timezone parsing with proper "daylight/standard" time. No worries on inproper "timezone offset"

- preserved 2 data structure.
  - "Obj" for quick access. So that we don't need "localstorage", simply save the "timezone name" on "URL" and parsed/render it to screen
  - "Array" for "Fuse" search.

- real-time update ( 2 places -> <SearchedTimezones /> and <Timezones /> selected timezones )
  - Fuse -> <SearchedTimezones /> only the "serached timezones" not the whole > 400 long timezones.
  - <Timezones /> works fine


