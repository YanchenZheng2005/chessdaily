import { supabase } from "@/lib/supabaseClient";

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;     // ← 必须 await

  // 取得所有新闻并筛选
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .contains("events", [slug]);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        {slug.replace(/-/g, " ").toUpperCase()}
      </h1>

      {!news || news.length === 0 ? (
        <p>No news for this event.</p>
      ) : (
        <ul className="space-y-4">
          {news.map(item => (
            <li key={item.id} className="border p-4 rounded">
              <a href={`/news/${item.slug}`} className="text-xl text-blue-600 hover:underline">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
