"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationProps {
  isAuthenticated?: boolean
}

export function Navigation({ isAuthenticated = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navLinkClassName =
    "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-semibold text-neutral-600 transition-colors hover:border-red-700 hover:text-neutral-950"
  const mobileLinkClassName =
    "block border-l-4 border-transparent px-4 py-2 text-base font-semibold text-neutral-700 transition-colors hover:border-red-700 hover:bg-red-50/70 hover:text-neutral-950"

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-black/10 bg-white/88 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 mr-2 overflow-hidden">
                  <Image
                    src="/images/medical-robot.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    className="scale-125"
                  />
                </div>
                <span className="ghibli-title text-xl font-extrabold">就職面接練習スケジューラー</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={navLinkClassName}>
                ホーム
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/admin/schedule" className={navLinkClassName}>
                    スケジュール管理
                  </Link>
                  <Link href="/admin/teachers" className={navLinkClassName}>
                    教員管理
                  </Link>
                </>
              ) : (
                <Link href="/schedule" className={navLinkClassName}>
                  面接予約
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <Button onClick={handleSignOut} size="sm">
                ログアウト
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">教員ログイン</Link>
              </Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-700"
            >
              <span className="sr-only">メニューを開く</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white/96 sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={mobileLinkClassName}>
              ホーム
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/admin/schedule" className={mobileLinkClassName}>
                  スケジュール管理
                </Link>
                <Link href="/admin/teachers" className={mobileLinkClassName}>
                  教員管理
                </Link>
              </>
            ) : (
              <Link href="/schedule" className={mobileLinkClassName}>
                面接予約
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className={cn(mobileLinkClassName, "w-full text-left")}
              >
                ログアウト
              </button>
            ) : (
              <Link href="/login" className={mobileLinkClassName}>
                教員ログイン
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
