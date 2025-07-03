"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn({ email, password })
      router.push("/admin/schedule")
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.message === "Invalid login credentials") {
        setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
      } else {
        setError(`ログインに失敗しました: ${err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ghibli-bg min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full ghibli-card p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 mx-auto overflow-hidden">
                <Image
                  src="/images/nurse-robot.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  className="scale-125"
                />
              </div>
            </div>
            <h1 className="ghibli-title text-2xl font-bold">教員ログイン</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="ghibli-input w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="ghibli-input w-full"
              />
            </div>

            <button type="submit" disabled={isLoading} className="ghibli-button w-full">
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
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
