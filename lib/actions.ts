"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { interpretNewsInterest, generateChatResponse } from "./ai"

export async function addToHistory(article: { url: string; title: string; source?: string }) {
    const session = await auth();
    if (!session?.user?.id) return;

    try {
        await prisma.history.create({
            data: {
                userId: session.user.id,
                articleUrl: article.url,
                title: article.title,
                source: article.source
            }
        });
    } catch (error) {
        console.error("Failed to add to history:", error);
    }
}

export async function updatePreferences(interest: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const interpretedQuery = await interpretNewsInterest(interest);

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            newsInterest: interest,
            searchQuery: interpretedQuery
        }
    });

    revalidatePath("/");
}

export async function sendChatMessage(content: string, sessionId?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let currentSessionId = sessionId;

    // Create new session if none exists
    if (!currentSessionId) {
        const newSession = await prisma.chatSession.create({
            data: {
                userId: session.user.id,
                title: content.slice(0, 50) + "..."
            }
        });
        currentSessionId = newSession.id;
    }

    // Save user message
    await prisma.message.create({
        data: {
            sessionId: currentSessionId,
            role: "user",
            content: content
        }
    });

    // Get previous messages for context
    const history = await prisma.message.findMany({
        where: { sessionId: currentSessionId },
        orderBy: { createdAt: "asc" },
        take: 10
    });

    // Generate AI response
    const response = await generateChatResponse(content, history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
    })));

    // Save assistant message
    await prisma.message.create({
        data: {
            sessionId: currentSessionId,
            role: "assistant",
            content: response
        }
    });

    return { content: response, sessionId: currentSessionId };
}

export async function toggleSaveArticle(article: {
    url: string;
    title: string;
    source?: string;
    description?: string;
    thumbnail?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existing = await prisma.savedArticle.findUnique({
        where: {
            userId_articleUrl: {
                userId: session.user.id,
                articleUrl: article.url
            }
        }
    });

    if (existing) {
        await prisma.savedArticle.delete({
            where: { id: existing.id }
        });
        revalidatePath("/saved");
        return { saved: false };
    } else {
        await prisma.savedArticle.create({
            data: {
                userId: session.user.id,
                articleUrl: article.url,
                title: article.title,
                source: article.source,
                description: article.description,
                thumbnail: article.thumbnail
            }
        });
        revalidatePath("/saved");
        return { saved: true };
    }
}
