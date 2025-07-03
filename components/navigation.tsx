"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface NavigationProps {
  isAuthenticated?: boolean
}

export function Navigation({ isAuthenticated = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <nav className="bg-blue-50 border-b border-blue-100 shadow-sm">
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
                <span className="ghibli-title text-xl font-bold">就職面接練習スケジューラー</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-600 hover:text-gray-800 hover:border-blue-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                ホーム
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/admin/schedule"
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:border-blue-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    スケジュール管理
                  </Link>
                  <Link
                    href="/admin/teachers"
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:border-blue-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    教員管理
                  </Link>
                </>
              ) : (
                <Link
                  href="/schedule"
                  className="border-transparent text-gray-600 hover:text-gray-800 hover:border-blue-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  面接予約
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <button onClick={handleSignOut} className="ghibli-button text-sm">
                ログアウト
              </button>
            ) : (
              <Link href="/login" className="ghibli-button text-sm">
                教員ログイン
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
            >
              ホーム
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/admin/schedule"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
                >
                  スケジュール管理
                </Link>
                <Link
                  href="/admin/teachers"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
                >
                  教員管理
                </Link>
              </>
            ) : (
              <Link
                href="/schedule"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
              >
                面接予約
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
              >
                ログアウト
              </button>
            ) : (
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-800"
              >
                教員ログイン
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
