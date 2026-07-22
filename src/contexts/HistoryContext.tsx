import { createContext, useContext, useState, ReactNode } from "react"

export interface Message {
  role: "user" | "assistant"
  content: string
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  timestamp: number
}

interface HistoryContextType {
  conversations: Conversation[]
  activeId: string | null
  addConversation: (conv: Conversation) => void
  updateConversation: (id: string, messages: Message[], model: string) => void
  deleteConversation: (id: string) => void
  setActiveId: (id: string | null) => void
  clearAll: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai-conversations")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [activeId, setActiveId] = useState<string | null>(null)

  const saveToStorage = (next: Conversation[]) => {
    localStorage.setItem("ai-conversations", JSON.stringify(next))
  }

  const addConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const next = [conv, ...prev]
      saveToStorage(next)
      return next
    })
    setActiveId(conv.id)
  }

  const updateConversation = (id: string, messages: Message[], model: string) => {
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages,
              model,
              title: messages[0]?.content.slice(0, 40) || c.title,
              timestamp: Date.now(),
            }
          : c
      )
      saveToStorage(next)
      return next
    })
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      saveToStorage(next)
      return next
    })
    if (activeId === id) setActiveId(null)
  }

  const clearAll = () => {
    setConversations([])
    localStorage.removeItem("ai-conversations")
    setActiveId(null)
  }

  return (
    <HistoryContext.Provider
      value={{ conversations, activeId, addConversation, updateConversation, deleteConversation, setActiveId, clearAll }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider")
  return ctx
}
