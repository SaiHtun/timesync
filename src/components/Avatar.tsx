import Me from "../../public/sai_linkedin_img.jpeg";

export default function Avatar() {
  return (
    <a href="https://saihtun.xyz">
      <div className="w-9 h-9 round-full shadow-sm ">
        <img
          src={Me}
          alt="this is sai's picture"
          className="rounded-full object-cover"
        />
      </div>
    </a>
  );
}
