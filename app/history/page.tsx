import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";

export default async function HistoryPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login"); // Fixed redirect
    }

    const historyItems = await prisma.history.findMany({
        where: { userId: session.user.id },
        orderBy: { viewedAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reading History</h1>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                {historyItems.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No history yet. Read some news!
                    </div>
                ) : (
                    <div className="divide-y">
                        {historyItems.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col gap-1 hover:bg-muted/50 transition-colors">
                                <Link href={`/news/${encodeURIComponent(item.articleUrl)}`} className="font-medium hover:underline">
                                    {item.title}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{item.source}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {item.viewedAt?.toLocaleDateString()} {item.viewedAt?.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
