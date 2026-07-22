import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const MODELS = [
  { id: "openai/gpt-5.5", name: "GPT 5.5", provider: "OpenAI" },
  { id: "openai/gpt-5.4", name: "GPT 5.4", provider: "OpenAI" },
  { id: "openai/gpt-5.3-chat", name: "GPT 5.3 Chat", provider: "OpenAI" },
  { id: "openai/gpt-5.1-instant", name: "GPT 5.1 Instant", provider: "OpenAI" },
  { id: "openai/gpt-5", name: "GPT 5", provider: "OpenAI" },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "xai/grok-4.1-fast-non-reasoning", name: "Grok 4.1 Fast", provider: "xAI" },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic" },
  { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic" },
  { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5", provider: "Anthropic" },
  { id: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic" },
  { id: "anthropic/claude-opus-4.7", name: "Claude Opus 4.7", provider: "Anthropic" },
  { id: "anthropic/claude-opus-4.8", name: "Claude Opus 4.8", provider: "Anthropic" },
  { id: "anthropic/claude-fable-5", name: "Claude Fable 5", provider: "Anthropic" },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek" },
  { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "DeepSeek" },
  { id: "deepseek/deepseek-v3.2-thinking", name: "DeepSeek V3.2 Thinking", provider: "DeepSeek" },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", provider: "Google" },
  { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro", provider: "Google" },
  { id: "google/gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", provider: "Google" },
  { id: "alibaba/qwen3-max", name: "Qwen3 Max", provider: "Alibaba" },
  { id: "meta/llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta" },
  { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6", provider: "Moonshot" },
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = MODELS.find((m) => m.id === value)

  const grouped = MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, typeof MODELS>)

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border-[3px] border-neo-black bg-white px-4 py-3 text-left font-bold shadow-neo transition-all hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px] dark:border-white/30 dark:bg-neo-dark-card dark:shadow-neo-purple",
          open && "shadow-neo-active translate-x-[4px] translate-y-[4px]"
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm font-black">{selected?.name || "Select Model"}</span>
          <span className="text-xs opacity-70">{selected?.provider || ""}</span>
        </div>
        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-[400px] w-full overflow-auto rounded-xl border-[3px] border-neo-black bg-white p-2 shadow-neo scrollbar-hide dark:border-white/30 dark:bg-neo-dark-card dark:shadow-neo-purple">
          {Object.entries(grouped).map(([provider, models]) => (
            <div key={provider} className="mb-2">
              <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                {provider}
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onChange(model.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors hover:bg-neo-yellow dark:hover:bg-neo-purple",
                    value === model.id && "bg-neo-yellow dark:bg-neo-purple"
                  )}
                >
                  <span>{model.name}</span>
                  {value === model.id && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
