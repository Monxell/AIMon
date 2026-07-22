import { Header } from "./components/Header"
import { ChatArea } from "./components/ChatArea"
import { HistoryProvider } from "./contexts/HistoryContext"

function App() {
  return (
    <HistoryProvider>
      <div className="min-h-screen bg-neo-light text-neo-black dark:bg-neo-dark dark:text-white transition-colors">
        <Header />
        <ChatArea />
      </div>
    </HistoryProvider>
  )
}

export default App
