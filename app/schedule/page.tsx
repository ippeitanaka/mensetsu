"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Navigation } from "@/components/navigation"
import { getTeachers, getAvailableSlots } from "@/lib/api"
import type { Teacher, AvailableSlot } from "@/types/models"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function Schedule() {
  const [date, setDate] = useState<Value>(new Date())
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all") // デフォルトを "all" に変更
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [selectedDateSlots, setSelectedDateSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const teachersData = await getTeachers()
        setTeachers(teachersData)

        // 全教員の予約枠を取得
        const allSlots = await getAvailableSlots()
        setAvailableSlots(allSlots)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        let slots = []
        if (selectedTeacher === "all") {
          // 全教員の予約枠を取得
          slots = await getAvailableSlots()
        } else {
          // 特定の教員の予約枠を取得
          slots = await getAvailableSlots(selectedTeacher)
        }
        setAvailableSlots(slots)
      } catch (error) {
        console.error("Error fetching slots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [selectedTeacher])

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

  return (
    <div className="ghibli-bg app-shell">
      <Navigation />
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="ghibli-title text-3xl font-bold text-center">面接予約</h1>
            <div className="relative w-10 h-10 ml-3 overflow-hidden">
              <Image
                src="/images/ambulance.png"
                alt="救急車"
                fill
                style={{ objectFit: "contain" }}
                className="scale-125"
              />
            </div>
          </div>

          <Card className="ghibli-card mb-8">
            <CardContent className="p-6">
              <div className="mb-6">
                <label htmlFor="teacher" className="app-label">
                  教員を選択
                </label>
                <select
                  id="teacher"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  className="ghibli-input w-full sm:w-auto"
                  disabled={loading || teachers.length === 0}
                >
                  <option value="all">全員</option>
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

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h2 className="app-panel-title mb-4">年間カレンダー</h2>
                  <div className="ghibli-calendar">
                    <Calendar onChange={setDate} value={date} locale="ja-JP" tileClassName={tileClassName} />
                  </div>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <div className="app-status-swatch app-status-swatch--available"></div>
                      <span>予約可能</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <div className="app-status-swatch app-status-swatch--full"></div>
                      <span>満員</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="app-panel-title mb-4">
                    {date instanceof Date
                      ? `${format(date, "yyyy年M月d日", { locale: ja })}の予約状況`
                      : "日付を選択してください"}
                  </h2>

                  {selectedDateSlots.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`app-slot-card p-4 ${slot.is_full ? "app-slot-card--full" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-neutral-950">
                                {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                              </p>
                              <p className="text-sm text-neutral-600">{(slot.teacher as any)?.name || "教員名不明"}</p>
                            </div>
                            <div>
                              {slot.is_full ? (
                                <span className="app-status-chip app-status-chip--full">満員</span>
                              ) : (
                                <span className="app-status-chip app-status-chip--available">予約可能</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className="mt-4 text-sm text-neutral-600">※ 予約を希望する場合は、教員に直接連絡してください。</p>
                    </div>
                  ) : date instanceof Date ? (
                    <div className="py-8 text-center">
                      <p className="text-neutral-500">この日の予約枠はありません</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="app-footer py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-500">Copyright © {new Date().getFullYear()} TMC DX Committee</p>
        </div>
      </footer>
    </div>
  )
}
