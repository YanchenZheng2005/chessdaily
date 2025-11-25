"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import newsData from "@/data/news.json";
import liveRatings from "@/data/live-ratings.json";

type Player = {
  rank: number;
  name: string;
  fed: string;
  rating: number;
  born: number;
};

type RatingData = {
  updated_at: string;
  classical: Player[];
  rapid: Player[];
  blitz: Player[];
};

const newsList = newsData;
const ratingData = liveRatings as RatingData;


export default function Home() {
  // 按发布时间倒序（最新在前）
  const sortedNews = [...newsList].sort(
    (a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );

  // 分页状态
  const [page, setPage] = useState(0);
  const pageSize = 4; // 每页显示4条新闻

  // 当前页的内容
  const startIndex = page * pageSize;
  const pagedNews = sortedNews.slice(startIndex, startIndex + pageSize);

  const [timeControl, setTimeControl] = useState<"classical" | "rapid" | "blitz">("classical");
  const ratingPlayers = ratingData[timeControl];

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-6">ChessDaily</h1>

      <p className="text-lg text-gray-700 mb-8">
        Daily chess news, tournament highlights, and global player updates.
      </p>

      {/* 两栏布局：左边新闻，右边积分榜 */}
      <div className="mt-10 flex flex-col md:flex-row gap-8">
        {/* 左侧：新闻列表 */}
        <section className="flex-1">
          {/* 标题 + 按钮一行 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Latest News</h2>

            <button
              onClick={() =>
                setPage((page + 1) % Math.ceil(sortedNews.length / pageSize))
              }
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-6">
            {pagedNews.map((item) => (
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

        {/* 右侧：积分榜 */}
<aside className="w-full md:w-[500px] shrink-0 flex flex-col">
  <h2 className="text-lg font-semibold mb-2">Top Ratings</h2>

  {/* 切换 Classical / Rapid / Blitz */}
  <div className="flex gap-3 mb-2 text-sm">
    <button
      onClick={() => setTimeControl("classical")}
      className={
        timeControl === "classical"
          ? "font-semibold border-b-2 border-black pb-1"
          : "text-gray-400 pb-1"
      }
    >
      Classical
    </button>
    <button
      onClick={() => setTimeControl("rapid")}
      className={
        timeControl === "rapid"
          ? "font-semibold border-b-2 border-black pb-1"
          : "text-gray-400 pb-1"
      }
    >
      Rapid
    </button>
    <button
      onClick={() => setTimeControl("blitz")}
      className={
        timeControl === "blitz"
          ? "font-semibold border-b-2 border-black pb-1"
          : "text-gray-400 pb-1"
      }
    >
      Blitz
    </button>
  </div>

  {/* 排行榜表格：根据 timeControl 显示不同数据 */}
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
        {ratingPlayers.map((p) => (
          <tr key={`${timeControl}-${p.rank}`} className="odd:bg-white even:bg-gray-50">
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

      </div>
    </main>
  );
}
