import { useState, useRef, useEffect } from "react"
import { Send, Trash2, MessageSquare, X, Clock, PanelLeftClose, PanelLeft, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ModelSelector } from "./ModelSelector"
import { ChatMessage } from "./ChatMessage"
import { LoadingSpinner } from "./LoadingSpinner"
import { useHistory } from "@/contexts/HistoryContext"
import type { Message } from "@/contexts/HistoryContext"

export function ChatArea() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("openai/gpt-5.5")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { conversations, activeId, addConversation, updateConversation, deleteConversation, setActiveId, clearAll } = useHistory()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (activeId) {
      const conv = conversations.find((c) => c.id === activeId)
      if (conv) {
        setMessages(conv.messages)
        setModel(conv.model)
      }
    } else {
      setMessages([])
    }
  }, [activeId, conversations])

  const handleNewChat = () => {
    setMessages([])
    setPrompt("")
    setActiveId(null)
    setModel("openai/gpt-5.5")
  }

  const handleSend = async () => {
    if (!prompt.trim() || loading) return

    const userMsg = prompt.trim()
    setPrompt("")

    let currentMessages: Message[]
    let currentId: string

    if (!activeId) {
      currentId = Math.random().toString(36).substring(2, 9)
      currentMessages = [{ role: "user", content: userMsg }]
      addConversation({
        id: currentId,
        title: userMsg.slice(0, 40) + (userMsg.length > 40 ? "..." : ""),
        messages: currentMessages,
        model,
        timestamp: Date.now(),
      })
    } else {
      currentId = activeId
      currentMessages = [...messages, { role: "user", content: userMsg }]
      updateConversation(currentId, currentMessages, model)
    }

    setMessages(currentMessages)
    setLoading(true)

    try {
      const res = await fetch(
        `https://api-nanzz.my.id/docs/api/ai/chatday.php?prompt=${encodeURIComponent(userMsg)}&model=${encodeURIComponent(model)}`
      )
      const data = await res.json()

      if (data.status && data.result) {
        const assistantMsg = data.result.response
        const usedModel = data.result.model || model
        const finalMessages: Message[] = [...currentMessages, { role: "assistant", content: assistantMsg, model: usedModel }]

        setMessages(finalMessages)
        updateConversation(currentId, finalMessages, usedModel)
      } else {
        throw new Error("Invalid response")
      }
    } catch (err) {
      const errorMessages: Message[] = [
        ...currentMessages,
        { role: "assistant", content: "Sorry, an error occurred while processing your request. Please try again later!", model },
      ]
      setMessages(errorMessages)
      updateConversation(currentId, errorMessages, model)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const loadConversation = (id: string) => {
    setActiveId(id)
    setSidebarOpen(false)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r-[3px] border-neo-black bg-white transition-transform duration-300 dark:border-white/20 dark:bg-neo-dark-card ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 lg:border-r-[3px]`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b-[3px] border-neo-black p-4 dark:border-white/20">
            <h2 className="text-sm font-black uppercase tracking-wider">Conversations</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border-[2px] border-neo-black dark:border-white/30"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-auto p-3 scrollbar-hide">
            {conversations.length === 0 && (
              <div className="rounded-xl border-[2px] border-dashed border-neo-black/30 p-4 text-center dark:border-white/20">
                <p className="text-xs font-bold opacity-50">No conversations yet</p>
                <p className="mt-1 text-xs opacity-40">Start a new chat!</p>
              </div>
            )}
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`group relative cursor-pointer rounded-xl border-[3px] p-3 transition-all ${
                    activeId === conv.id
                      ? "border-neo-black bg-neo-yellow shadow-neo dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple"
                      : "border-neo-black/20 bg-transparent hover:border-neo-black hover:bg-white/50 dark:border-white/10 dark:hover:border-white/30 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{conv.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs opacity-50">
                        <Clock className="h-3 w-3" />
                        {formatTime(conv.timestamp)}
                      </div>
                      <p className="mt-0.5 text-xs opacity-40">{conv.model.split("/").pop()}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clear All at bottom */}
          {conversations.length > 0 && (
            <div className="border-t-[3px] border-neo-black p-3 dark:border-white/20">
              <button
                onClick={clearAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-neo-black bg-white px-4 py-2 text-xs font-black shadow-neo transition-all hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px] dark:bg-neo-dark-card dark:border-white/30 dark:shadow-neo-purple"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar - all buttons same height as ModelSelector (h-12) */}
        <div className="flex items-center gap-3 border-b-[3px] border-neo-black bg-neo-light p-4 dark:border-white/20 dark:bg-neo-dark">
          {/* Sidebar Toggle - same height as model selector */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-neo-black bg-white shadow-neo transition-all hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px] dark:border-white/30 dark:bg-neo-dark-card dark:shadow-neo-purple lg:hidden"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          {/* New Chat Button - same height as model selector, 1:1 square on mobile, text on desktop */}
          <button
            onClick={handleNewChat}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] border-neo-black bg-neo-yellow px-4 shadow-neo transition-all hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px] dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden text-sm font-black sm:inline">New Chat</span>
          </button>

          {/* Model Selector - flex-1 to fill remaining space */}
          <div className="flex-1">
            <ModelSelector value={model} onChange={setModel} />
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-neo border-[3px] border-neo-black bg-neo-yellow p-6 shadow-neo dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple">
                  <h2 className="text-2xl font-black">Welcome!</h2>
                  <p className="mt-2 text-sm font-bold opacity-80">
                    Select an AI model and start chatting with Neo-Brutalism style.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} model={msg.model} />
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-neo-black bg-white shadow-neo dark:border-white/30 dark:bg-neo-dark-card dark:shadow-neo-purple">
                  <LoadingSpinner className="h-5 w-5" />
                </div>
                <div className="rounded-xl border-[3px] border-neo-black bg-white px-4 py-3 shadow-neo dark:border-white/30 dark:bg-neo-dark-card dark:shadow-neo-purple">
                  <span className="text-sm font-bold">AI is typing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t-[3px] border-neo-black bg-neo-light p-4 dark:border-white/20 dark:bg-neo-dark">
          <div className="mx-auto flex max-w-3xl gap-3">
            <Input
              placeholder="Type your message here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading || !prompt.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
