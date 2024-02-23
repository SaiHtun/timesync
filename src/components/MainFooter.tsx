import Avatar from "./Avatar";
import GithubLink from "./GithubLink";

export default function MainFooter() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 w-full h-[100px] flex items-center justify-between px-10">
      <div className="text-sm flex items-center gap-4">
        <p>Wanna help me improve the app?</p>
        <GithubLink />
      </div>
      <div className="flex gap-4 items-center text-sm">
        <p>
          <span className="text-zinc-400">built by</span> Sai
        </p>
        <Avatar />
      </div>
    </div>
  );
}
