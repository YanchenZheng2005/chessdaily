import Link from "next/link";
import Image from "next/image";
import newsData from "@/data/news.json";
import liveRatings from "@/data/live-ratings.json";

const newsList = newsData.data;
const ratingPlayers = liveRatings.players;

export default function Home() {
  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold mb-6">ChessDaily</h1>

      <p className="text-lg text-gray-700 mb-8">
        Daily chess news, tournament highlights, and global player updates.
      </p>

      {/* 两栏布局：左边新闻，右边积分榜 */}
      <div className="mt-10 flex flex-col md:flex-row gap-8">
        {/* 左侧：新闻列表 */}
        <section className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>

          <div className="space-y-6">
            {newsList.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block">
                <article className="rounded-lg border p-4 hover:bg-gray-50 cursor-pointer flex flex-col sm:flex-row gap-4">
                  {/* 封面图 */}
                  <div className="relative w-full sm:w-40 h-24">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  {/* 文本部分 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.publish_date).toLocaleString()} ·{" "}
                      {item.comment_count} comments
                    </p>
                    <p className="mt-2 text-gray-700">{item.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* 右侧：自家积分榜 */}
        <aside className="w-full md:w-80 shrink-0">
          <h2 className="text-lg font-semibold mb-3">Top 20 Classical Ratings</h2>

          <div className="rounded-lg border bg-white text-xs overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">#</th>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Fed</th>
                  <th className="px-2 py-1 text-right">Rating</th>
                  <th className="px-2 py-1 text-right">Born</th>
                </tr>
              </thead>
              <tbody>
                {ratingPlayers.map((p) => (
                  <tr
                    key={p.rank}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-2 py-1">{p.rank}</td>
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">{p.fed}</td>
                    <td className="px-2 py-1 text-right">{p.rating}</td>
                    <td className="px-2 py-1 text-right">{p.born}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="px-2 py-1 text-[10px] text-gray-400 border-t">
              Snapshot based on FIDE classical Top 20 (Nov 2025).
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
