"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { texts } from "@/lib/texts/fa"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type Props = {
  sessionId: string
  onComplete: () => void
}

export function AiChat({ sessionId, onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: texts.assessment.chatIntro },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isLoading])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || isFinalizing) return
    const nextMessages = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/assessment/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error ?? texts.assessment.chatError)
      }
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? "" }])
    } catch (err) {
      console.error(err)
      setError(texts.assessment.chatError)
    } finally {
      setIsLoading(false)
    }
  }

  const finalizeChat = async () => {
    if (isLoading || isFinalizing) return
    setIsFinalizing(true)
    setError(null)
    try {
      const response = await fetch(`/api/assessment/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, finalize: true }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error ?? texts.assessment.chatError)
      }
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      }
      onComplete()
    } catch (err) {
      console.error(err)
      setError(texts.assessment.chatError)
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const canFinish = messages.some((message) => message.role === "user")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.assessment.chatTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={containerRef}
          className="max-h-[420px] space-y-3 overflow-y-auto rounded-lg border bg-white p-4 shadow-sm"
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user"
            return (
              <div key={`${message.role}-${index}`} className={isUser ? "text-right" : "text-left"}>
                <div
                  className={
                    isUser
                      ? "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2 text-sm leading-6 text-primary-foreground"
                      : "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl bg-slate-100 px-4 py-2 text-sm leading-6 text-slate-800"
                  }
                >
                  {message.content}
                </div>
              </div>
            )
          })}
          {isLoading ? (
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-xs text-slate-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                {texts.assessment.chatThinking}
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={texts.assessment.chatPlaceholder}
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={sendMessage} disabled={isLoading || isFinalizing || !input.trim()}>
              {texts.assessment.chatSend}
            </Button>
            <Button
              variant="outline"
              onClick={finalizeChat}
              disabled={!canFinish || isLoading || isFinalizing}
            >
              {isFinalizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {texts.assessment.chatFinishing}
                </>
              ) : (
                texts.assessment.chatFinish
              )}
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <p className="text-xs text-muted-foreground">{texts.assessment.chatHint}</p>
        </div>
      </CardContent>
    </Card>
  )
}
