import Image from "next/image";
import { getPlayerBySlug, getNewsForPlayer } from "@/lib/players";

export default async function PlayerPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; // 必须 await！

  const player = await getPlayerBySlug(slug);
  if (!player) {
    return <div className="p-6 text-lg">Player not found.</div>;
  }

  const relatedNews = await getNewsForPlayer(slug);

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* 🔥 顶部标题 + Home Page 按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{player.name}</h1>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Home Page
        </a>
      </div>

      <div className="flex gap-10">
        <div>
          {player.avatar_url ? (
            <Image
              src={player.avatar_url.trim()}
              alt={player.name}
              width={260}
              height={300}
              className="rounded shadow"
            />
          ) : (
            <div className="w-[260px] h-[300px] bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Bio 已完全移除 */}

          <h2 className="text-3xl font-semibold mb-2">Achievements</h2>
          {player.achievements ? (
            <ul className="list-disc ml-6 space-y-1">
              {Object.entries(player.achievements).map(([title, years]: any) => (
                <li key={title}>
                  <strong>{title}:</strong>{" "}
                  {Array.isArray(years)
                    ? years
                        .map((y: any) =>
                          typeof y === "object"
                            ? `${y.year}${y.shared ? " (shared)" : ""}`
                            : y
                        )
                        .join(", ")
                    : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>No achievements listed.</p>
          )}
        </div>
      </div>

      <hr className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Related News</h2>

        {relatedNews.length === 0 ? (
          <p>No related news yet.</p>
        ) : (
          <div className="space-y-6">
            {relatedNews.map((news: any) => (
              <a
                key={news.id}
                href={`/news/${news.slug}`}
                className="block p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="text-xl font-semibold">{news.title}</h3>
                <p className="text-gray-600 text-sm">{news.summary}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(news.created_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
