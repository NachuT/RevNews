"use client"

import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function RefreshButton() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        router.refresh()
        // Give it a little delay for the animation feel
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-full hover:bg-primary/10 transition-colors"
            title="Fetch fresh news"
        >
            <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
    )
}
