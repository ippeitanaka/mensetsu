"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

// 状態の型定義
export type TeacherActionState = {
  error: string | null
  success: boolean
  teacher: any | null
}

// 初期状態
export const initialState: TeacherActionState = {
  error: null,
  success: false,
  teacher: null,
}

// アクション関数を修正
export async function addTeacherAction(prevState: TeacherActionState, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    if (!name || !email) {
      return {
        ...prevState,
        error: "名前とメールアドレスを入力してください",
        success: false,
      }
    }

    // まず教員が既に存在するかチェック
    const { data: existingTeacher, error: checkError } = await supabaseAdmin()
      .from("teachers")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116は「結果が見つからない」エラーなので、これは正常
      console.error("Error checking existing teacher:", checkError)
      return {
        ...prevState,
        error: "教員の確認中にエラーが発生しました: " + checkError.message,
        success: false,
      }
    }

    if (existingTeacher) {
      return {
        ...prevState,
        error: "このメールアドレスは既に使用されています",
        success: false,
      }
    }

    // 教員を追加
    const { data, error } = await supabaseAdmin().from("teachers").insert([{ name, email }]).select().single()

    if (error) {
      console.error("Error adding teacher:", error)
      return {
        ...prevState,
        error: "教員の追加に失敗しました: " + error.message,
        success: false,
      }
    }

    revalidatePath("/admin/teachers")
    return {
      error: null,
      success: true,
      teacher: data,
    }
  } catch (error: any) {
    console.error("Unexpected error adding teacher:", error)
    return {
      ...prevState,
      error: "予期せぬエラーが発生しました: " + (error.message || "不明なエラー"),
      success: false,
    }
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    if (!id) {
      return { error: "教員IDが指定されていません", success: false }
    }

    const { error } = await supabaseAdmin().from("teachers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting teacher:", error)
      return { error: "教員の削除に失敗しました: " + error.message, success: false }
    }

    revalidatePath("/admin/teachers")
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Unexpected error deleting teacher:", error)
    return { error: "予期せぬエラーが発生しました: " + (error.message || "不明なエラー"), success: false }
  }
}
