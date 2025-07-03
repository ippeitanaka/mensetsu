import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// ブラウザ環境かどうかをチェック
const isBrowser = typeof window !== "undefined"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser, // ブラウザ環境でのみセッションを保持
    autoRefreshToken: isBrowser, // ブラウザ環境でのみトークンを自動更新
  },
})
