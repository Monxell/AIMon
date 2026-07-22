import { createContext, useContext, useState, ReactNode } from "react"

export interface ChatItem {
  id: string
  prompt: string
  response: string
  model: string
  timestamp: number
}

interface HistoryContextType {
  history: ChatItem[]
  addChat: (item: ChatItem) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ChatItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat-history")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const addChat = (item: ChatItem) => {
    setHistory((prev) => {
      const next = [item, ...prev]
      localStorage.setItem("chat-history", JSON.stringify(next))
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("chat-history")
  }

  return (
    <HistoryContext.Provider value={{ history, addChat, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider")
  return ctx
}
