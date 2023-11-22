export function switchTheme() {
  const { classList } = document.querySelector("html") as HTMLElement;

  if (classList.contains("dark")) {
    classList.remove("dark");
    localStorage.removeItem("theme");
  } else {
    classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}
