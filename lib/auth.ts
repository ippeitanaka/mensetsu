import { supabase } from "./supabase"
import type { LoginCredentials } from "@/types/auth"

export async function signIn({ email, password }: LoginCredentials) {
  try {
    // まず、メールアドレスとパスワードでサインインを試みる
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // サインインに失敗した場合、ユーザーが存在するか確認
      try {
        const { data: teacherData } = await supabase.from("teachers").select("*").eq("email", email).single()

        // 教員が存在し、かつ指定されたパスワードと一致する場合
        if (teacherData && password === "TOYOqq01") {
          // セッションを手動で作成（簡易的な認証）
          const session = {
            user: {
              id: teacherData.id,
              email: teacherData.email,
              user_metadata: {
                name: teacherData.name,
              },
            },
            expires_at: new Date().getTime() + 24 * 60 * 60 * 1000, // 24時間
          }

          // セッション情報をローカルストレージに保存
          if (typeof window !== "undefined") {
            localStorage.setItem("teacher_session", JSON.stringify(session))
          }

          return { user: session.user, session }
        }
      } catch (err) {
        console.error("Error checking teacher:", err)
      }

      throw new Error("Invalid login credentials")
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export async function signOut() {
  try {
    // Supabaseのセッションをクリア
    const { error } = await supabase.auth.signOut()

    // 手動で作成したセッションもクリア
    if (typeof window !== "undefined") {
      localStorage.removeItem("teacher_session")
    }

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    // まず、Supabaseの認証を確認
    const { data, error } = await supabase.auth.getUser()

    if (!error && data.user) {
      return data.user
    }

    // Supabaseの認証がない場合、手動で作成したセッションを確認
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("teacher_session")
      if (sessionStr) {
        const session = JSON.parse(sessionStr)
        const now = new Date().getTime()

        // セッションが有効期限内かチェック
        if (session && session.expires_at > now) {
          return session.user
        }

        // 期限切れの場合は削除
        localStorage.removeItem("teacher_session")
      }
    }

    return null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
