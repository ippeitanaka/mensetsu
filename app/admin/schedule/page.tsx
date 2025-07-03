"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTeachers, getAvailableSlots } from "@/lib/api"
import type { Teacher, AvailableSlot, TimeSlot } from "@/types/models"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Image from "next/image"
// 以下のインポートを追加
import { addAvailableSlotsAction, updateSlotFullStatusAction, deleteAvailableSlotAction } from "./actions"

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function AdminSchedule() {
  const [date, setDate] = useState<Value>(new Date())
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [selectedDateSlots, setSelectedDateSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ start: "09:00", end: "10:00" }])
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push("/login")
        return
      }
      setIsAuthenticated(true)
      fetchData()
    }

    checkAuth()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const teachersData = await getTeachers()
      setTeachers(teachersData)

      if (teachersData.length > 0) {
        setSelectedTeacher(teachersData[0].id)
        const slots = await getAvailableSlots(teachersData[0].id)
        setAvailableSlots(slots)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTeacher && isAuthenticated) {
      const fetchSlots = async () => {
        setLoading(true)
        try {
          const slots = await getAvailableSlots(selectedTeacher)
          setAvailableSlots(slots)
        } catch (error) {
          console.error("Error fetching slots:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchSlots()
    }
  }, [selectedTeacher, isAuthenticated])

  useEffect(() => {
    if (date instanceof Date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      const filteredSlots = availableSlots.filter((slot) => slot.date === formattedDate)
      setSelectedDateSlots(filteredSlots)
    }
  }, [date, availableSlots])

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacher(e.target.value)
  }

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: "09:00", end: "10:00" }])
  }

  const handleRemoveTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots]
    newTimeSlots.splice(index, 1)
    setTimeSlots(newTimeSlots)
  }

  const handleTimeSlotChange = (index: number, field: "start" | "end", value: string) => {
    const newTimeSlots = [...timeSlots]
    newTimeSlots[index][field] = value
    setTimeSlots(newTimeSlots)
  }

  // handleSaveTimeSlots関数を以下に置き換え
  const handleSaveTimeSlots = async () => {
    if (!selectedTeacher || !(date instanceof Date)) return

    const formattedDate = format(date, "yyyy-MM-dd")

    try {
      setLoading(true)
      const result = await addAvailableSlotsAction(selectedTeacher, formattedDate, timeSlots)

      if (result.success) {
        // 再取得
        const slots = await getAvailableSlots(selectedTeacher)
        setAvailableSlots(slots)

        // フォームをリセット
        setTimeSlots([{ start: "09:00", end: "10:00" }])
      } else {
        console.error("Error saving time slots:", result.error)
      }
    } catch (error) {
      console.error("Error saving time slots:", error)
    } finally {
      setLoading(false)
    }
  }

  // handleToggleFullStatus関数を以下に置き換え
  const handleToggleFullStatus = async (slotId: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      const result = await updateSlotFullStatusAction(slotId, !currentStatus)

      if (result.success) {
        // 再取得
        const slots = await getAvailableSlots(selectedTeacher)
        setAvailableSlots(slots)
      } else {
        console.error("Error updating slot status:", result.error)
      }
    } catch (error) {
      console.error("Error updating slot status:", error)
    } finally {
      setLoading(false)
    }
  }

  // handleDeleteSlot関数を以下に置き換え
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("この予約枠を削除してもよろしいですか？")) return

    try {
      setLoading(true)
      const result = await deleteAvailableSlotAction(slotId)

      if (result.success) {
        // 再取得
        const slots = await getAvailableSlots(selectedTeacher)
        setAvailableSlots(slots)
      } else {
        console.error("Error deleting slot:", result.error)
      }
    } catch (error) {
      console.error("Error deleting slot:", error)
    } finally {
      setLoading(false)
    }
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null

    const formattedDate = format(date, "yyyy-MM-dd")
    const hasSlot = availableSlots.some((slot) => slot.date === formattedDate)
    const isFull = availableSlots.some((slot) => slot.date === formattedDate && slot.is_full)

    if (hasSlot) {
      return isFull ? "full-day" : "available-day"
    }

    return null
  }

  if (!isAuthenticated) {
    return null // ログイン確認中は何も表示しない
  }

  return (
    <div className="ghibli-bg min-h-screen flex flex-col">
      <Navigation isAuthenticated={true} />
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="ghibli-title text-3xl font-bold text-center">スケジュール管理</h1>
            <div className="relative w-10 h-10 ml-3 overflow-hidden">
              <Image
                src="/images/firefighter-robot.png"
                alt="消防士ロボット"
                fill
                style={{ objectFit: "contain" }}
                className="scale-125"
              />
            </div>
          </div>

          <div className="ghibli-card p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
                教員を選択
              </label>
              <select
                id="teacher"
                value={selectedTeacher}
                onChange={handleTeacherChange}
                className="ghibli-input w-full sm:w-auto"
                disabled={loading || teachers.length === 0}
              >
                {teachers.length === 0 ? (
                  <option value="">教員が登録されていません</option>
                ) : (
                  teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="ghibli-title text-xl font-semibold mb-4">年間カレンダー</h2>
                <div className="ghibli-calendar">
                  <Calendar onChange={setDate} value={date} locale="ja-JP" tileClassName={tileClassName} />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 mr-2"></div>
                    <span className="text-sm">予約可能</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 mr-2"></div>
                    <span className="text-sm">満員</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="ghibli-title text-xl font-semibold mb-4">
                  {date instanceof Date
                    ? `${format(date, "yyyy年M月d日", { locale: ja })}の予約枠`
                    : "日付を選択してください"}
                </h2>

                {date instanceof Date && (
                  <div className="space-y-6">
                    {selectedDateSlots.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-medium">登録済みの予約枠</h3>
                        {selectedDateSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`p-4 rounded-lg border ${
                              slot.is_full ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleFullStatus(slot.id, slot.is_full)}
                                  className={`px-3 py-1 rounded text-xs font-medium ${
                                    slot.is_full
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  }`}
                                >
                                  {slot.is_full ? "予約可能にする" : "満員にする"}
                                </button>
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                                >
                                  削除
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-4">新しい予約枠を追加</h3>
                      <div className="space-y-4">
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="flex flex-wrap gap-4 items-center">
                            <div>
                              <label
                                htmlFor={`start-${index}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                開始時間
                              </label>
                              <input
                                id={`start-${index}`}
                                type="time"
                                value={slot.start}
                                onChange={(e) => handleTimeSlotChange(index, "start", e.target.value)}
                                className="ghibli-input"
                              />
                            </div>
                            <div>
                              <label htmlFor={`end-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                終了時間
                              </label>
                              <input
                                id={`end-${index}`}
                                type="time"
                                value={slot.end}
                                onChange={(e) => handleTimeSlotChange(index, "end", e.target.value)}
                                className="ghibli-input"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeSlot(index)}
                              className="mt-6 px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                              disabled={timeSlots.length === 1}
                            >
                              削除
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <button
                          type="button"
                          onClick={handleAddTimeSlot}
                          className="ghibli-button bg-red-500 hover:bg-red-600"
                        >
                          時間枠を追加
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveTimeSlots}
                          className="ghibli-button"
                          disabled={loading}
                        >
                          {loading ? "保存中..." : "保存"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-blue-50 border-t border-blue-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">Copyright © {new Date().getFullYear()} TMC DX Committee</p>
        </div>
      </footer>
    </div>
  )
}
