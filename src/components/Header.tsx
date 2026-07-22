import { Bot } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-neo-black bg-neo-yellow dark:bg-neo-purple dark:border-white/20">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-neo-black bg-white dark:bg-neo-dark-card dark:border-white/30">
            <Bot className="h-6 w-6 text-neo-black dark:text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-neo-black dark:text-white">
              AI CHAT
            </h1>
            <p className="text-xs font-bold text-neo-black/70 dark:text-white/70">
              Multi-Model Neo-Brutalism
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
