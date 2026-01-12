"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Settings2, X, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updatePreferences } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface CustomizeFeedDialogProps {
    initialInterest?: string
    isLoggedIn: boolean
}

export function CustomizeFeedDialog({ initialInterest = "", isLoggedIn }: CustomizeFeedDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [interest, setInterest] = React.useState(initialInterest)
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!interest.trim()) return

        setIsPending(true)
        try {
            await updatePreferences(interest)
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to update preferences:", error)
        } finally {
            setIsPending(false)
        }
    }

    if (!isLoggedIn) {
        return (
            <Button variant="outline" onClick={() => router.push("/login")}>
                <Settings2 className="mr-2 h-4 w-4" /> Customize Feed
            </Button>
        )
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant="outline">
                    <Settings2 className="mr-2 h-4 w-4" /> Customize Feed
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50 animate-in zoom-in-95 fade-in duration-200">
                    <div className="flex items-center justify-between mb-2">
                        <Dialog.Title className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> Customize Your Feed
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-1 rounded-full hover:bg-muted transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="text-muted-foreground text-sm mb-6">
                        RevNews is now <strong>hyper-strict</strong>. Tell us exactly what you want to see, and our AI will build a high-precision filter to ensure you see only the most relevant stories.
                    </Dialog.Description>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="interest" className="text-sm font-semibold">Your Interests</label>
                            <textarea
                                id="interest"
                                placeholder="e.g. 'Deep tech breakthroughs in energy and space', 'NFL playoff predictions and sports business', 'Local news about SF and tech culture'"
                                className="w-full min-h-[120px] p-4 rounded-xl border bg-muted/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-black"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Feed"
                                )}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
