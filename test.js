export function currentTime(timezoneName) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    timeZone: timezoneName || getCurrentUserTimezone(),
  };

  return new Intl.DateTimeFormat("en-En", options).format(new Date());
}

export function getCurrentUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const str = "America/Kentucky/Monticello";

console.log(currentTime(str));
