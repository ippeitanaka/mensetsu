import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "就職面接練習スケジューラー",
    short_name: "面接練習",
    description: "学生が面接練習を教員に依頼するためのスケジュール管理アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4c81",
    icons: [
      {
        src: "/icon.png",
        sizes: "1517x1846",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "1517x1846",
        type: "image/png",
      },
    ],
  }
}