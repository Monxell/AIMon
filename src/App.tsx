import { useCallback } from "react"
import { Header } from "./components/Header"
import { ChatArea } from "./components/ChatArea"
import { HistoryProvider } from "./contexts/HistoryContext"

function App() {
  const handleNewChat = useCallback(() => {
    // Scroll to top or any other new chat logic
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <HistoryProvider>
      <div className="min-h-screen bg-neo-light text-neo-black dark:bg-neo-dark dark:text-white transition-colors">
        <Header onNewChat={handleNewChat} />
        <ChatArea onNewChat={handleNewChat} />
      </div>
    </HistoryProvider>
  )
}

export default App
