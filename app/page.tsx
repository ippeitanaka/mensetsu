"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// キャラクターの配列
const characters = [
  {
    src: "/images/medical-robot.png",
    alt: "医療ロボットキャラクター",
  },
  {
    src: "/images/nurse-robot.png",
    alt: "看護ロボットキャラクター",
  },
  {
    src: "/images/firefighter-robot.png",
    alt: "消防士ロボットキャラクター",
  },
  {
    src: "/images/ambulance.png",
    alt: "救急車",
  },
]

export default function Home() {
  // ランダムなキャラクターを選択
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // ページ読み込み時にランダムなキャラクターを選択
    const randomIndex = Math.floor(Math.random() * characters.length)
    setSelectedCharacter(characters[randomIndex])

    // アニメーションを開始
    setIsAnimating(true)

    // 定期的にアニメーションを再開
    const animationInterval = setInterval(() => {
      setIsAnimating(false)
      setTimeout(() => setIsAnimating(true), 100)
    }, 5000)

    return () => clearInterval(animationInterval)
  }, [])

  return (
    <div className="ghibli-bg app-shell">
      <Navigation />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <Card className="ghibli-card max-w-4xl w-full border-black/10 bg-white/90">
          <CardContent className="p-6 sm:p-10">
            <div className="text-center mb-8">
            <h1 className="ghibli-title text-3xl sm:text-4xl font-bold mb-4">就職面接練習スケジューラー</h1>
            <p className="text-lg text-neutral-600">学生が面接練習を教員に依頼するためのスケジュール管理アプリです</p>
            </div>

            <div className="mb-8 flex flex-col items-center justify-center gap-8 md:flex-row">
              <div className="relative h-40 w-40 md:h-48 md:w-48">
                <div
                  className={`absolute inset-0 ${
                    isAnimating ? "animate-bounce" : ""
                  } transition-all duration-300 ease-in-out`}
                >
                  <Image
                    src={selectedCharacter.src || "/placeholder.svg"}
                    alt={selectedCharacter.alt}
                    fill
                    style={{ objectFit: "contain" }}
                    className="scale-125"
                  />
                </div>
              </div>
              <div className="max-w-md">
                <h2 className="ghibli-title mb-4 text-2xl font-semibold">面接練習の予約方法</h2>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start">
                    <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border border-red-200 bg-red-50 text-sm font-bold text-red-700">
                      1
                    </span>
                    <span>「面接予約可能日を確認する」ボタンで教員の空き状況を確認</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border border-red-200 bg-red-50 text-sm font-bold text-red-700">
                      2
                    </span>
                    <span>希望する教員と日時を選択</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border border-red-200 bg-red-50 text-sm font-bold text-red-700">
                      3
                    </span>
                    <span>教員に直接連絡して予約を確定</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild className="text-center">
                <Link href="/schedule">面接予約可能日を確認する</Link>
              </Button>
              <Button asChild variant="outline" className="border-red-700 bg-red-50 text-red-800 hover:bg-red-100 hover:text-red-900">
                <Link href="/login">教員ログイン</Link>
              </Button>
            </div>
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
