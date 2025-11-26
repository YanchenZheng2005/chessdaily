import Link from "next/link";
import Image from "next/image";

type PlayerPageProps = {
  params: Promise<{ slug: string }>;
};

// Tab 列表
const tabs = [
  { name: "Magnus Carlsen", slug: "magnus-carlsen" },
  { name: "Fabiano Caruana", slug: "fabiano-caruana" },
  
];

// 动态加载玩家 JSON
async function loadPlayerData(slug: string) {
  try {
    const data = await import(`../../../data/players/${slug}.json`);
    return data.default;
  } catch {
    return null;
  }
}

// 年份渲染组件
function Years({ list }: { list: any[] }) {
  return (
    <>
      {list.map((item, i) => {
        const year = typeof item === "number" ? item : item.year;
        const shared = typeof item === "object" && item.shared;

        return (
          <span key={i}>
            {year}
            {shared ? " (shared)" : ""}
            {i < list.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </>
  );
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await loadPlayerData(slug);

  if (!player) return <p>Player not found.</p>;

  return (
    <main className="p-8 max-w-[95rem] mx-auto">
      {/* ------------------ Tabs ------------------ */}
      <div className="flex gap-6 mb-6 text-lg">
        {tabs.map((t) => {
          const isActive = t.slug === slug;

          return (
            <Link
              key={t.slug}
              href={`/players/${t.slug}`}
              className="pb-1 border-b-2"
              style={{
                borderColor: isActive ? "black" : "transparent",
              }}
            >
              <span
                className={
                  isActive
                    ? "font-extrabold text-2xl leading-none"
                    : "text-lg text-gray-500 leading-none"
                }
              >
                {t.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ------------------ Name + Avatar + Achievements ------------------ */}
<div className="mt-4 flex gap-32 items-start">
  {/* 左边：名字 + 头像 */}
  {/* 左边：名字 + 头像 */}
<div className="shrink-0">
  {/* 名字 */}
  <h1 className="text-4xl font-bold mb-4">{player.name}</h1>

  {/* 头像 */}
  <Image
    src={player.image}
    alt={player.name}
    width={260}
    height={260}
    className="rounded-md"
  />

  {/* 版权说明（如果 JSON 中存在 imageCredit，就自动显示） */}
  {player.imageCredit && (
    <p className="text-xs text-gray-500 mt-2 leading-snug">
      Photo by{" "}
      {player.imageCredit.authorUrl ? (
        <a
          href={player.imageCredit.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {player.imageCredit.authorName}
        </a>
      ) : (
        player.imageCredit.authorName
      )}
      {player.imageCredit.modified ? ", cropped by us" : ""}, licensed under{" "}
      {player.imageCredit.licenseUrl ? (
        <a
          href={player.imageCredit.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {player.imageCredit.licenseName}
        </a>
      ) : (
        player.imageCredit.licenseName
      )}
      .
    </p>
  )}
</div>


{/* 右边：成就 */}
<div className="flex-1 min-w-0">
  <h2 className="text-4xl font-bold mb-4">Achievements</h2>

  <ul className="space-y-1 text-2xl leading-snug">
    {Object.entries(player.achievements ?? {}).map(([key, rawList]) => {
      // 防止 rawList 不是数组的情况
      const list = Array.isArray(rawList) ? rawList : [];

      // 空数组：不显示该项
      if (list.length === 0) return null;

      // key → 显示名称的映射
      const labels: Record<string, string> = {
        WCC: "World Chess Championship",
        WorldRapid: "World Rapid Championship",
        WorldBlitz: "World Blitz Championship",
        WorldCup: "FIDE World Cup",
        TataSteel: "Tata Steel Masters",
        NorwayChess: "Norway Chess",
        Sinquefield: "Sinquefield Cup",
      };

      const label = labels[key] ?? key; // 没映射就显示原 key

      return (
        <li key={key}>
          <b>{label}:</b>{" "}
          <Years list={list} />
        </li>
      );
    })}
  </ul>
</div>

</div>
<hr className="border-t border-black mt-8" />
{/* 下方 News 板块 */}
<div className="mt-10">
  <h2 className="text-4xl font-bold mb-4">Recent News</h2>

  {/* 占位区域，你将来可以改成循环文章 */}
  <p className="text-lg text-gray-600">
    No news yet. Content coming soon...
  </p>
</div>
    </main>
  );
}
