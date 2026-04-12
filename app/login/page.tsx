"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
    <div className="ghibli-bg app-shell">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="ghibli-card max-w-md w-full">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
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
              <div className="mb-4 whitespace-pre-line rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="app-label">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="app-label">
                  パスワード
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="app-footer py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-500">Copyright © {new Date().getFullYear()} TMC DX Committee</p>
        </div>
      </footer>
    </div>
  )
}
