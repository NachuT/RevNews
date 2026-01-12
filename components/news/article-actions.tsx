"use client"

import * as React from "react"
import { Share2, Bookmark, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleSaveArticle } from "@/lib/actions"
import { toast } from "sonner"

interface ArticleActionsProps {
    article: {
        url: string
        title: string
        source?: string
        description?: string
        thumbnail?: string
    }
    isInitialSaved?: boolean
}

export function ArticleActions({ article, isInitialSaved = false }: ArticleActionsProps) {
    const [isSaved, setIsSaved] = React.useState(isInitialSaved)
    const [isSaving, setIsSaving] = React.useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await toggleSaveArticle(article)
            setIsSaved(result.saved)
            toast.success(result.saved ? "Article saved to your collection" : "Article removed from collection")
        } catch (error) {
            toast.error("Sign in to save articles")
        } finally {
            setIsSaving(false)
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: `Check out this news on RevNews: ${article.title}`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard")
            }
        } catch (err) {
            console.error("Error sharing:", err)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={isSaved ? "default" : "outline"}
                size="icon"
                onClick={handleSave}
                disabled={isSaving}
                className={isSaved ? "bg-primary text-white" : ""}
            >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
