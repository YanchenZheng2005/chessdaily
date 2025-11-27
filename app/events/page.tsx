import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type NewsRow = {
  events: string[] | null;
};

export default async function EventsPage() {
  const { data } = await supabase
    .from("news")
    .select("events") as unknown as { data: NewsRow[] };

  // 🔥 明确声明 Set 类型
  const allEvents: Set<string> = new Set();

  data?.forEach((n) => {
    if (Array.isArray(n.events)) {
      n.events.forEach((e) => allEvents.add(e));
    }
  });

  const events: string[] = Array.from(allEvents);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Events</h1>

      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li key={ev}>
              <Link
                href={`/events/${ev}`}
                className="text-blue-600 hover:underline text-lg"
              >
                {ev.replace(/-/g, " ").toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
