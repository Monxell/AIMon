import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  model?: string
}

export function ChatMessage({ role, content, model }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] shadow-neo",
          isUser
            ? "border-neo-black bg-neo-yellow dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple"
            : "border-neo-black bg-white dark:bg-neo-dark-card dark:border-white/30 dark:shadow-neo-purple"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-xl border-[3px] p-4 shadow-neo",
          isUser
            ? "border-neo-black bg-neo-yellow dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple"
            : "border-neo-black bg-white dark:bg-neo-dark-card dark:border-white/30 dark:shadow-neo-purple"
        )}
      >
        {!isUser && model && (
          <div className="mb-2 text-xs font-black uppercase tracking-wider opacity-60">
            {model}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  )
}
