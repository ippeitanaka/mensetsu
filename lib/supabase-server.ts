import { createClient } from "@supabase/supabase-js"

// サーバーサイドでのみ使用するSupabaseクライアント
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Supabase URL and Service Role Key are required")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// 遅延初期化を使用して、必要なときだけクライアントを作成
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = () => {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createServerSupabaseClient()
  }
  return _supabaseAdmin
}
