import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type PlayerRow = {
  name: string;
  slug: string;
};

export default async function PlayersPage() {
  // 从数据库读取所有棋手
  const { data } = await supabase
    .from("players")
    .select("name, slug")
    .order("name", { ascending: true }) as unknown as {
      data: PlayerRow[];
    };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Players</h1>

      {!data || data.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/players/${p.slug}`}
                className="text-blue-600 hover:underline text-lg"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
