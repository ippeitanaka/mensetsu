import { createClient } from "@supabase/supabase-js"

type BrowserSupabaseClient = ReturnType<typeof createClient>

let browserSupabaseClient: BrowserSupabaseClient | null = null

export function getSupabaseClient(): BrowserSupabaseClient {
  if (browserSupabaseClient) {
    return browserSupabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are required")
  }

  const isBrowser = typeof window !== "undefined"

  browserSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
    },
  })

  return browserSupabaseClient
}
