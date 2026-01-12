"use client"

import * as React from "react"
import { Send, Bot, User, Loader2, Sparkles, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { sendChatMessage } from "@/lib/actions"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export function ChatInterface({
    initialMessages = [],
    sessionId
}: {
    initialMessages?: Message[]
    sessionId?: string
}) {
    const [messages, setMessages] = React.useState<Message[]>(initialMessages)
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentSessionId, setCurrentSessionId] = React.useState(sessionId)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await sendChatMessage(input, currentSessionId)
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.content
            }
            setMessages(prev => [...prev, assistantMessage])
            if (response.sessionId) {
                setCurrentSessionId(response.sessionId)
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, {
                id: "error",
                role: "assistant",
                content: "Sorry, I had trouble finding news for that. Please try again."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-5xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-tight">RevNews AI Assistant</h2>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setMessages([])}>
                    <MessageSquare className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/20">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-black">What news are you following?</h1>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Ask anything about current events, local news, or complex global topics. I search the live web for answers.
                        </p>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-sm pt-4">
                            {["What is the latest on the Iran protests?", "Summarize the housing market trends.", "Give me tech news from today."].map(q => (
                                <button
                                    key={q}
                                    onClick={() => setInput(q)}
                                    className="text-xs p-3 rounded-xl border bg-white hover:bg-slate-50 text-left text-black transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((m) => (
                    <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                            m.role === "user" ? "bg-white border" : "bg-primary text-white"
                        )}>
                            {m.role === "user" ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                            m.role === "user"
                                ? "bg-primary text-white"
                                : "bg-white border text-black prose prose-slate prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-white"
                        )}>
                            {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border p-4 rounded-2xl flex items-center gap-2 text-muted-foreground text-sm shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Searching global news spectrum...
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                <div className="relative max-w-3xl mx-auto">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a news question..."
                        rows={1}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-12 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-black"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    )
}
