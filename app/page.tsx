"use client";
import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/lib/news";
import liveRatings from "@/data/live-ratings.json";
import { useState } from "react";

// 因为右侧积分榜仍然需要客户端交互，所以拆为组件：
function RatingsSidebar() {
  const ratingData = liveRatings as any;
  const [timeControl, setTimeControl] = useState<"classical" | "rapid" | "blitz">("classical");
  const players = ratingData[timeControl];

  return (
    <aside className="w-full md:w-[500px] shrink-0 flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Top Ratings</h2>

      {/* 切换 Classical / Rapid / Blitz */}
      <div className="flex gap-3 mb-2 text-sm">
        {["classical", "rapid", "blitz"].map(tc => (
          <button
            key={tc}
            onClick={() => setTimeControl(tc as any)}
            className={
              timeControl === tc
                ? "font-semibold border-b-2 border-black pb-1"
                : "text-gray-400 pb-1"
            }
          >
            {tc[0].toUpperCase() + tc.slice(1)}
          </button>
        ))}
      </div>

      {/* 排行榜表格 */}
      <div className="rounded-lg border bg-white text-sm max-h-[830px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Fed</th>
              <th className="px-2 py-1 text-right">Rating</th>
              <th className="px-2 py-1 text-right">Born</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p: any) => (
              <tr key={p.rank} className="odd:bg-white even:bg-gray-50">
                <td className="px-2 py-1">{p.rank}</td>
                <td className="px-2 py-1 whitespace-nowrap">{p.name}</td>
                <td className="px-2 py-1">{p.fed}</td>
                <td className="px-2 py-1 text-right">{p.rating}</td>
                <td className="px-2 py-1 text-right">{p.born}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-2 py-1 text-[10px] text-gray-400 border-t">
          Snapshot based on FIDE {timeControl} ratings.
        </p>
      </div>
    </aside>
  );
}


// ---------------------------
// 首页（Server Component）
// ---------------------------
export default async function HomePage() {
  const newsList = await getAllNews();

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-5xl font-bold">ChessDaily</h1>

  <div className="flex gap-3">
    <Link href="/players" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
      Players
    </Link>

    {/* 🔥 新增的 Events 按钮 */}
    <Link href="/events" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
      Events
    </Link>
  </div>
</div>


      <p className="text-lg text-gray-700 mb-8">
        Daily chess news, tournament highlights, and global player updates.
      </p>

      {/* 两栏布局：左新闻 · 右积分榜 */}
      <div className="mt-10 flex flex-col md:flex-row gap-8">
        
        {/* 左侧：新闻 */}
        <section className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>

          {newsList.length === 0 ? (
            <p>No news yet.</p>
          ) : (
            <div className="space-y-6">
              {newsList.map((item: any) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="block">
                  <article className="rounded-lg border p-4 hover:bg-gray-50 cursor-pointer flex flex-col sm:flex-row gap-4">
                    
                    {/* 封面图 */}
                    {item.cover_url && (
                      <div className="relative w-full sm:w-40 h-24">
                        <Image
                          src={item.cover_url}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* 文本 */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                      <p className="mt-2 text-gray-700">{item.summary}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 右侧：积分榜（Client Component） */}
        <RatingsSidebar />
      </div>
    </main>
  );
}
