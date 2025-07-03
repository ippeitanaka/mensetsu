"use client"

import { useState, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTeachers } from "@/lib/api"
import type { Teacher } from "@/types/models"
import Image from "next/image"

// 以下のインポートを追加
import { addTeacherAction, deleteTeacherAction, initialState } from "./actions"

// 送信ボタンコンポーネント
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="ghibli-button">
      {pending ? "追加中..." : "教員を追加"}
    </button>
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

          <div className="ghibli-card p-6 mb-8">
            <h2 className="ghibli-title text-xl font-semibold mb-4">教員を追加</h2>

            {(error || state.error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error || state.error}
              </div>
            )}

            {/* フォーム部分 */}
            <form action={formAction} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  名前
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ghibli-input w-full"
                  placeholder="例: 山田 太郎"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ghibli-input w-full"
                  placeholder="例: yamada@example.com"
                />
              </div>

              <SubmitButton />
            </form>
          </div>

          <div className="ghibli-card p-6">
            <h2 className="ghibli-title text-xl font-semibold mb-4">教員一覧</h2>

            {loading ? (
              <p className="text-center py-4">読み込み中...</p>
            ) : teachers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">教員が登録されていません</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        名前
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        メールアドレス
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900">
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
