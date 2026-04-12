"use client"

import { useState, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTeachers } from "@/lib/api"
import type { Teacher } from "@/types/models"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// 以下のインポートを追加
import { addTeacherAction, deleteTeacherAction, initialState } from "./actions"

// 送信ボタンコンポーネント
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "追加中..." : "教員を追加"}
    </Button>
  )
}

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // useActionStateを使用
  const [state, formAction] = useActionState(addTeacherAction, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }
        setIsAuthenticated(true)
        fetchTeachers()
      } catch (err) {
        console.error("Error checking authentication:", err)
        setError("認証中にエラーが発生しました。再度ログインしてください。")
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // フォーム送信後の処理
  useEffect(() => {
    if (state.success) {
      setName("")
      setEmail("")
      fetchTeachers()
    }
    if (state.error) {
      setError(state.error)
    }
  }, [state])

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const data = await getTeachers()
      setTeachers(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      setError("教員一覧の取得に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  // handleDelete関数
  const handleDelete = async (id: string) => {
    if (!confirm("この教員を削除してもよろしいですか？")) return

    try {
      setLoading(true)
      const result = await deleteTeacherAction(id)
      if (result.success) {
        fetchTeachers()
      } else {
        setError(result.error || "教員の削除に失敗しました")
      }
    } catch (error) {
      console.error("Error deleting teacher:", error)
      setError("教員の削除中にエラーが発生しました。")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">認証を確認中...</p>
      </div>
    )
  }

  return (
    <div className="ghibli-bg min-h-screen flex flex-col">
      <Navigation isAuthenticated={true} />
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="ghibli-title text-3xl font-bold text-center">教員管理</h1>
            <div className="relative w-10 h-10 ml-3 overflow-hidden">
              <Image
                src="/images/nurse-robot.png"
                alt="看護ロボット"
                fill
                style={{ objectFit: "contain" }}
                className="scale-125"
              />
            </div>
          </div>

          <Card className="ghibli-card mb-8">
            <CardContent className="p-6">
              <h2 className="app-panel-title mb-4">教員を追加</h2>

              {(error || state.error) && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error || state.error}
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="name" className="app-label">
                    名前
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 山田 太郎"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="app-label">
                    メールアドレス
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="例: yamada@example.com"
                  />
                </div>

                <SubmitButton />
              </form>
            </CardContent>
          </Card>

          <Card className="ghibli-card">
            <CardContent className="p-6">
              <h2 className="app-panel-title mb-4">教員一覧</h2>

              {loading ? (
                <p className="py-4 text-center">読み込み中...</p>
              ) : teachers.length === 0 ? (
                <p className="py-4 text-center text-neutral-500">教員が登録されていません</p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-black/10 bg-white/80">
                  <table className="min-w-full divide-y divide-black/10">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-neutral-500"
                        >
                          名前
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-neutral-500"
                        >
                          メールアドレス
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-bold uppercase tracking-[0.08em] text-neutral-500"
                        >
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 bg-white">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-semibold text-neutral-950">{teacher.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-neutral-600">{teacher.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <Button
                              onClick={() => handleDelete(teacher.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-700 hover:bg-red-50 hover:text-red-900"
                            >
                              削除
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
