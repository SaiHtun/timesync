export function currentTime(timezoneName = getCurrentUserTimezoneName()) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: timezoneName,
  };

  return new Intl.DateTimeFormat("en-En", options).format(new Date());
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
