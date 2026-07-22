import { useState, useRef, useEffect } from "react"
import { Send, Trash2, History } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ModelSelector } from "./ModelSelector"
import { ChatMessage } from "./ChatMessage"
import { LoadingSpinner } from "./LoadingSpinner"
import { useHistory } from "@/contexts/HistoryContext"

export function ChatArea() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("anthropic/claude-sonnet-4.6")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; model?: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { history, addChat, clearHistory } = useHistory()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const handleSend = async () => {
    if (!prompt.trim() || loading) return

    const userMsg = prompt.trim()
    setPrompt("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch(
        `https://api-nanzz.my.id/docs/api/ai/chatday.php?prompt=${encodeURIComponent(userMsg)}&model=${encodeURIComponent(model)}`
      )
      const data = await res.json()

      if (data.status && data.result) {
        const assistantMsg = data.result.response
        const usedModel = data.result.model || model

        setMessages((prev) => [...prev, { role: "assistant", content: assistantMsg, model: usedModel }])

        addChat({
          id: Math.random().toString(36).substring(2, 9),
          prompt: userMsg,
          response: assistantMsg,
          model: usedModel,
          timestamp: Date.now(),
        })
      } else {
        throw new Error("Invalid response")
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan saat memproses permintaan. Coba lagi nanti ya!", model },
      ])
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

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="border-b-[3px] border-neo-black bg-neo-light p-4 dark:border-white/20 dark:bg-neo-dark">
        <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-80">
            <ModelSelector value={model} onChange={setModel} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
              <History className="mr-2 h-4 w-4" />
              Riwayat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([])
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="border-b-[3px] border-neo-black bg-white p-4 dark:border-white/20 dark:bg-neo-dark-card">
          <div className="container mx-auto">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">Riwayat Chat</h3>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Hapus Semua
              </Button>
            </div>
            <div className="max-h-40 space-y-2 overflow-auto scrollbar-hide">
              {history.length === 0 && <p className="text-xs opacity-60">Belum ada riwayat</p>}
              {history.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg border-[2px] border-neo-black p-2 text-xs dark:border-white/20"
                >
                  <div className="font-bold">{h.model}</div>
                  <div className="truncate opacity-70">{h.prompt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        <div className="container mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-neo border-[3px] border-neo-black bg-neo-yellow p-6 shadow-neo dark:bg-neo-purple dark:border-white/30 dark:shadow-neo-purple">
                <h2 className="text-2xl font-black">Selamat Datang!</h2>
                <p className="mt-2 text-sm font-bold opacity-80">
                  Pilih model AI dan mulai ngobrol dengan gaya Neo-Brutalism.
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
                <span className="text-sm font-bold">AI sedang mengetik...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t-[3px] border-neo-black bg-neo-light p-4 dark:border-white/20 dark:bg-neo-dark">
        <div className="container mx-auto flex gap-3">
          <Input
            placeholder="Ketik pesanmu di sini..."
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
  )
}
