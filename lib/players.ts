// lib/players.ts (完整的、已修复的版本)
import { supabase } from "./supabaseClient";

// ... (getAllPlayers 保持不变)

// 根据 slug 获取单个棋手 (保持已修复的版本)
export async function getPlayerBySlug(slug: string) {
  // ... (此函数保持你提供的已修复代码)
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  if (error) {
    const err = error as any; 
    
    // ---------------- 详细错误日志（用于排查真正的系统错误） ----------------
    console.error(`--- START: Detailed System Error for slug: ${slug} ---`);
    console.error("Error fetching player (Full Object):", error);
    console.error("Error Status:", err.status);
    console.error("Error Message:", err.message);
    console.error("Error Hint:", err.hint);
    console.error("Error Details:", err.details);
    
    const stringifyReplacer = (key: string, value: any) => { /* ... */ return value; };
    try {
        console.error("Error fetching player (JSON String):", JSON.stringify(err, stringifyReplacer, 2));
    } catch (e) {
        console.error("Could not stringify error object:", e);
    }
    console.error(`--- END: Detailed System Error for slug: ${slug} ---`);
    
    return null;
  }
  
  if (!data || data.length === 0) {
    return null; 
  }
  return data[0]; 
}

// 获取某棋手的相关新闻 (修复了错误报告)
export async function getNewsForPlayer(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    // 注意：.contains 要求 players 字段是数组类型 (text[])
    .contains("players", [slug]) 
    .order("created_at", { ascending: false });

  if (error) {
    const err = error as any; 
    
    // ---------------- 详细错误日志 ----------------
    console.error(`--- START: Detailed NEWS Error for slug: ${slug} ---`);
    console.error("Error fetching related news (Full Object):", error);
    console.error("Error Status:", err.status);
    console.error("Error Message:", err.message);
    console.error("Error Hint:", err.hint);
    console.error("Error Details:", err.details);
    console.error(`--- END: Detailed NEWS Error for slug: ${slug} ---`);
    
    return [];
  }

  return data;
}