// lib/news.ts (完整的、已修复的版本)
import { supabase } from "./supabaseClient";

// 获取所有新闻（按时间倒序）(修复了错误报告)
export async function getAllNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const err = error as any; 
    console.error("--- START: Detailed ALL NEWS Error ---");
    console.error("Error fetching all news (Full Object):", error);
    console.error("Error Status:", err.status);
    console.error("Error Message:", err.message);
    console.error("--- END: Detailed ALL NEWS Error ---");
    return [];
  }

  return data;
}

// 根据 slug 获取某一条新闻（用于新闻详情页）(修复了错误报告)
export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    const err = error as any; 
    console.error(`--- START: Detailed SINGLE NEWS Error for slug: ${slug} ---`);
    console.error("Error fetching news by slug (Full Object):", error);
    console.error("Error Status:", err.status);
    console.error("Error Message:", err.message);
    console.error("--- END: Detailed SINGLE NEWS Error ---");
    return null;
  }

  return data;
}