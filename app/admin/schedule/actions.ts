"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import type { TimeSlot } from "@/types/models"

export async function addAvailableSlotsAction(teacherId: string, date: string, timeSlots: TimeSlot[]) {
  if (!teacherId || !date || !timeSlots.length) {
    return { error: "必要な情報が不足しています" }
  }

  try {
    const slots = timeSlots.map((slot) => ({
      teacher_id: teacherId,
      date,
      start_time: slot.start,
      end_time: slot.end,
    }))

    const { data, error } = await supabaseAdmin().from("available_slots").insert(slots).select()

    if (error) throw error

    revalidatePath("/admin/schedule")
    return { success: true, slots: data }
  } catch (error: any) {
    console.error("Error adding available slots:", error)
    return { error: "予約枠の追加に失敗しました: " + error.message }
  }
}

export async function updateSlotFullStatusAction(id: string, isFull: boolean) {
  if (!id) {
    return { error: "スロットIDが指定されていません" }
  }

  try {
    const { error } = await supabaseAdmin().from("available_slots").update({ is_full: isFull }).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/schedule")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating slot status:", error)
    return { error: "ステータスの更新に失敗しました: " + error.message }
  }
}

export async function deleteAvailableSlotAction(id: string) {
  if (!id) {
    return { error: "スロットIDが指定されていません" }
  }

  try {
    const { error } = await supabaseAdmin().from("available_slots").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/schedule")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting slot:", error)
    return { error: "予約枠の削除に失敗しました: " + error.message }
  }
}
