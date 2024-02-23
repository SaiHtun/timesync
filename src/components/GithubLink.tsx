import { Github } from "lucide-react";

export default function GithubLink() {
  return (
    <a
      href="https://github.com/SaiHtun"
      className="hover:text-gray-400 transition-colors primary_border rounded-full p-2 shadow-sm bg-white dark:bg-zinc-900"
    >
      <Github size={20} />
    </a>
  );
}
