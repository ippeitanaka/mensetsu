import { supabase } from "./supabase"
import type { Teacher, AvailableSlot, TimeSlot } from "@/types/models"

// 教員関連の関数
export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase.from("teachers").select("*").order("name")

  if (error) {
    console.error("Error fetching teachers:", error)
    return []
  }

  return data || []
}

export async function addTeacher(name: string, email: string): Promise<Teacher | null> {
  const { data, error } = await supabase.from("teachers").insert([{ name, email }]).select().single()

  if (error) {
    console.error("Error adding teacher:", error)
    return null
  }

  return data
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const { error } = await supabase.from("teachers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting teacher:", error)
    return false
  }

  return true
}

// 利用可能な日程関連の関数
export async function getAvailableSlots(teacherId?: string): Promise<AvailableSlot[]> {
  let query = supabase.from("available_slots").select("*, teacher:teachers(name)")

  if (teacherId) {
    query = query.eq("teacher_id", teacherId)
  }

  const { data, error } = await query.order("date")

  if (error) {
    console.error("Error fetching available slots:", error)
    return []
  }

  return data || []
}

export async function addAvailableSlot(
  teacherId: string,
  date: string,
  timeSlots: TimeSlot[],
): Promise<AvailableSlot[]> {
  const slots = timeSlots.map((slot) => ({
    teacher_id: teacherId,
    date,
    start_time: slot.start,
    end_time: slot.end,
  }))

  const { data, error } = await supabase.from("available_slots").insert(slots).select()

  if (error) {
    console.error("Error adding available slots:", error)
    return []
  }

  return data || []
}

export async function updateSlotFullStatus(id: string, isFull: boolean): Promise<boolean> {
  const { error } = await supabase.from("available_slots").update({ is_full: isFull }).eq("id", id)

  if (error) {
    console.error("Error updating slot full status:", error)
    return false
  }

  return true
}

export async function deleteAvailableSlot(id: string): Promise<boolean> {
  const { error } = await supabase.from("available_slots").delete().eq("id", id)

  if (error) {
    console.error("Error deleting available slot:", error)
    return false
  }

  return true
}
