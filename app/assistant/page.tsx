import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChatInterface } from "@/components/news/chat-interface"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AssistantPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-8 text-center px-4">
                <div className="space-y-4">
                    <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-2">
                        <span className="text-5xl">🗞️</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight italic">
                        RevNews <span className="text-primary tracking-normal not-italic">AI</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        The world's first AI-first news assistant. Ask questions, compare perspectives, and discover the truth.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <a href="/login" className="flex-1">
                        <button className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95">
                            Get Started
                        </button>
                    </a>
                    <a href="/" className="flex-1">
                        <button className="w-full bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all active:scale-95">
                            Browse News
                        </button>
                    </a>
                </div>

                <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-left">
                    {[
                        { title: "Real-time Search", desc: "Always up to date with live web results." },
                        { title: "Bias Analysis", desc: "AI highlights the spectrum of media coverage." },
                        { title: "Instant TL;DR", desc: "Get complex global stories in seconds." }
                    ].map(f => (
                        <div key={f.title} className="p-6 rounded-2xl border bg-white shadow-sm space-y-2">
                            <h3 className="font-bold text-black">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-snug">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Get the most recent session if it exists
    const latestSession = await (prisma as any).chatSession.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        include: { messages: { orderBy: { createdAt: "asc" } } }
    })

    const initialMessages = latestSession?.messages.map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content
    })) || []

    return (
        <div className="h-full overflow-hidden">
            <ChatInterface
                initialMessages={initialMessages}
                sessionId={latestSession?.id}
            />
        </div>
    )
}
