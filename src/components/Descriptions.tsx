type Content = {
  id: number;
  title: string;
  descriptions: string[];
};

const contexts: Content[] = [
  {
    id: 1,
    title: "About",
    descriptions: [
      "Timesync is an ultimate web application for seamless global timezone coordination. Perfect for scheduling meetings, planning travel, and staying connected across different timezones. Excited to share the URL with your friends? we got you covered!",
    ],
  },
  {
    id: 2,
    title: "Tips",
    descriptions: [
      "Organizing timezone's rows :: hover over the left hand side of the timezone's row to drag and drop for re-arranging timezones.",
      "Schedule meeting minutes threshold :: click on the desire time's dial, move the pointer to the right direction horizontally and click on the blurry background. Then, the dotted red squre will turn into green!",
      "Sharing URL :: we don't do tidious job here, just one click to copy and share with others.",
      "Deleting timezone :: a trash bin icon will appear as you hover over the left hand side of the timezone's row, and click to delete.",
    ],
  },
  {
    id: 3,
    title: "Features",
    descriptions: [
      "Light, Dark mode.",
      "Lightning-fast fuzzy searching timezones.",
      "Share URL with beloved friends and family, and annoying co-workers.",
      "Schedule meeting minutes threshold.",
      "Support 12/24 hours format.",
      "Dials color options.",
    ],
  },
  {
    id: 4,
    title: "Constraints",
    descriptions: [
      "Better experience with desktop browser.",
      "Not every cities are searchable but all timezones are and they're case-insensitive. ( Ex: PST, gmt, pacific standard time, ... )",
    ],
  },
];

function Content({ content }: { content: Content }) {
  const { title, descriptions } = content;

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">{title}</h3>
      <div>
        {descriptions.map((description, index) => {
          return (
            <p
              key={index}
              className="text-sm text-zinc-500 dark:text-zinc-400 leading-6"
            >
              {description}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function Descriptions() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900  py-20 px-8">
      <div className="w-[1180px] xl:mx-auto space-y-12">
        {contexts.map((content) => (
          <Content key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
