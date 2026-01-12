import Link from "next/link";
import {
    Home,
    Sparkles,
    Menu,
    User,
    LogOut,
    History,
    Newspaper,
    BookOpen,
    Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

export async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-card h-screen sticky top-0">
                <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Newspaper className="w-6 h-6" />
                        <span>RevNews</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-black">
                            <Newspaper className="mr-2 h-4 w-4 text-blue-600" /> My Feed
                        </Button>
                    </Link>
                    <Link href="/assistant">
                        <Button variant="ghost" className="w-full justify-start text-black">
                            <Sparkles className="mr-2 h-4 w-4 text-primary" /> AI Assistant
                        </Button>
                    </Link>
                    <Link href="/saved">
                        <Button variant="ghost" className="w-full justify-start text-black">
                            <Bookmark className="mr-2 h-4 w-4 text-amber-600" /> Saved
                        </Button>
                    </Link>
                    <Link href="/history">
                        <Button variant="ghost" className="w-full justify-start text-black">
                            <History className="mr-2 h-4 w-4 text-slate-600" /> History
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    {session ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                    <span className="font-bold text-sm text-primary">
                                        {(session.user?.email?.[0] || session.user?.name?.[0] || "?").toUpperCase()}
                                    </span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold truncate text-black">{session.user?.name || "User"}</p>
                                    <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                                </div>
                            </div>
                            <form action={async () => {
                                "use server"
                                await signOut()
                            }}>
                                <Button variant="outline" className="w-full" size="sm">
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="w-full">Sign In</Button>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-0">
                <header className="md:hidden h-14 border-b flex items-center justify-between px-4 bg-card sticky top-0 z-10">
                    <Link href="/" className="font-bold text-lg text-primary flex items-center gap-2">
                        <Newspaper className="w-5 h-5" /> RevNews
                    </Link>
                    {session?.user && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="font-bold text-xs text-primary">
                                {(session.user?.email?.[0] || "?").toUpperCase()}
                            </span>
                        </div>
                    )}
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around z-50">
                <Link href="/" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
                    <Newspaper className="w-5 h-5" />
                    <span className="text-[10px]">My Feed</span>
                </Link>
                <Link href="/assistant" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px]">AI Assistant</span>
                </Link>
                <Link href="/saved" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-[10px]">Saved</span>
                </Link>
                <Link href="/history" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
                    <History className="w-5 h-5" />
                    <span className="text-[10px]">History</span>
                </Link>
                <Link href={session ? "/profile" : "/login"} className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
                    <User className="w-5 h-5" />
                    <span className="text-[10px]">{session ? "Profile" : "Login"}</span>
                </Link>
            </nav>
        </div>
    );
}
